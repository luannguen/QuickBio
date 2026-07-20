const { Client } = require('pg');
const crypto = require('crypto');

const args = process.argv.slice(2);
const params = {};

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].replace('--', '');
    params[key] = args[i+1];
    i++;
  }
}

if (!params.version || !params.desc || !params.files || !params.user) {
  console.error("Usage: node scripts/record-change.cjs --version <version> --desc <desc> --files <files> --user <user_id> [--prd <prd_id>] [--spec <spec_id>] [--adr <adr_id1,adr_id2>] [--rules <r1,r2>] [--skills <s1,s2>] [--patterns <p1,p2>]");
  process.exit(1);
}

const connectionString = "postgres://postgres.yrrfkdnwjwbwhecgkzps:Garankfc%40%231397445@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres";

// Helper to parse comma separated lists into task ref arrays
function parseRefs(csvString, defaultReason = 'Resolved for task') {
  if (!csvString) return null;
  return csvString.split(',').map(item => ({
    key: item.trim(),
    version: '1.0.0',
    reason: defaultReason
  }));
}

// Helper to parse document references
function parseDocRef(docId) {
  if (!docId) return null;
  return { document_id: docId.trim(), revision: 1 };
}

// Helper to parse multiple document references
function parseDocRefs(csvString) {
  if (!csvString) return null;
  return csvString.split(',').map(item => ({
    document_id: item.trim(),
    revision: 1
  }));
}

async function recordChange() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const changeId = crypto.randomUUID();
    const contextId = crypto.randomUUID();

    const prdRef = parseDocRef(params.prd);
    const specRef = parseDocRef(params.spec);
    const adrRefs = parseDocRefs(params.adr);
    const ruleRefs = parseRefs(params.rules, 'Rule checked during implementation');
    const skillRefs = parseRefs(params.skills, 'Skill used for implementation tasks');
    const patternRefs = parseRefs(params.patterns, 'Architecture pattern reused');

    // 1. Insert corresponding Task Context (Checkpoint)
    await client.query(`
      INSERT INTO dev_task_contexts (
        id, task_id, context_version, created_by, assumptions, 
        prd_reference, spec_reference, adr_references, 
        applied_rule_keys, applied_skill_keys, applied_pattern_keys
      )
      VALUES ($1, $2, 3, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      contextId, 
      `TASK-${params.version}`, 
      params.user,
      JSON.stringify([`Checkpoint created for ${params.desc}`]),
      prdRef ? JSON.stringify(prdRef) : null,
      specRef ? JSON.stringify(specRef) : null,
      adrRefs ? JSON.stringify(adrRefs) : null,
      ruleRefs ? JSON.stringify(ruleRefs) : null,
      skillRefs ? JSON.stringify(skillRefs) : null,
      patternRefs ? JSON.stringify(patternRefs) : null
    ]);

    // 2. Insert System Change
    await client.query(`
      INSERT INTO dev_system_changes (id, version_tag, change_type, title, description, execution_context_id, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [changeId, params.version, 'feature', `System Change: ${params.version}`, `${params.desc}\nFiles: ${params.files}`, contextId, params.user]);

    console.log("Successfully recorded system change and checkpoint!");
  } catch (err) {
    console.error("Error recording change:", err);
  } finally {
    await client.end();
  }
}

recordChange();

