import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function logSystemChange() {
  console.log("Logging AI Task Execution Context...");

  // 1. Create a dummy task context matching our current task
  const { data: taskContext, error: taskError } = await supabase
    .from('dev_task_contexts')
    .insert([{
      task_id: 'TASK-SYSTEM-CHANGES-UI',
      context_version: 1,
      applied_rule_keys: [
        { key: 'rule-ai-coding-rules', reason: 'Enforce coding standards' },
        { key: 'rule-agent-operational-protocol', reason: 'Follow execution plan' }
      ],
      applied_skill_keys: [
        { key: 'skill-ui-styling', reason: 'Build the Changes tab UI' }
      ],
      created_by: 'Antigravity AI Agent'
    }])
    .select()
    .single();

  if (taskError) {
    console.error("Error creating task context:", taskError.message);
    return;
  }
  console.log("✅ Task context created:", taskContext.id);

  console.log("Logging System Change...");

  // 2. Create the system change record tied to the task context
  const { data: systemChange, error: changeError } = await supabase
    .from('dev_system_changes')
    .insert([{
      version_tag: 'v1.1.0-dev',
      change_type: 'feature',
      title: 'Implement System Changes Module in Developer Control Center',
      description: 'Replaced the Coming Soon placeholder with a full data table listing system changes and linking them to their AI execution contexts.',
      execution_context_id: taskContext.id,
      created_by: 'Antigravity AI Agent'
    }])
    .select()
    .single();

  if (changeError) {
    console.error("Error creating system change:", changeError.message);
    return;
  }
  
  console.log("✅ System change created:", systemChange.id);
  console.log("Testing Developer Control Center workflow complete.");
}

logSystemChange().catch(console.error);
