-- Auto-generated artifacts sync script

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'rule-agent-operational-protocol',
  'rule',
  'AGENT OPERATIONAL PROTOCOL',
  'System rule: AGENT-OPERATIONAL-PROTOCOL.md',
  'repository',
  'rule/AGENT-OPERATIONAL-PROTOCOL.md',
  '1.0.0',
  'afdc1aa83dfc9f317ebd9e5d1d130d03',
  'global',
  'active',
  true,
  '{"task_types":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'rule-agentic-behavior',
  'rule',
  'AGENTIC BEHAVIOR',
  'System rule: AGENTIC-BEHAVIOR.md',
  'repository',
  'rule/AGENTIC-BEHAVIOR.md',
  '1.0.0',
  '9150f1009bd14cacd89c3dec36390fc0',
  'global',
  'active',
  true,
  '{"task_types":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'rule-ai-coding-rules',
  'rule',
  'AI CODING RULES',
  'System rule: AI-CODING-RULES.md',
  'repository',
  'rule/AI-CODING-RULES.md',
  '1.0.0',
  'e6226ac7eb2fce65930dd5c4475852c6',
  'global',
  'active',
  true,
  '{"task_types":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'rule-design-system-standard',
  'rule',
  'DESIGN SYSTEM STANDARD',
  'System rule: DESIGN-SYSTEM-STANDARD.md',
  'repository',
  'rule/DESIGN-SYSTEM-STANDARD.md',
  '1.0.0',
  '917a9f243c6f33da22384e807a8f6687',
  'global',
  'active',
  true,
  '{"task_types":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'rule-ui-ux-design-ruleset',
  'rule',
  'UI UX DESIGN RULESET',
  'System rule: UI-UX-DESIGN-RULESET.md',
  'repository',
  'rule/UI-UX-DESIGN-RULESET.md',
  '1.0.0',
  'fb3ab081d3ce389589c56c65e4cbdec7',
  'global',
  'active',
  true,
  '{"task_types":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-ab-testing',
  'skill',
  'ab testing',
  'Agent skill: ab-testing',
  'repository',
  '.agents/skills/ab-testing/SKILL.md',
  '1.0.0',
  'aa0ad6f40358b3d0584a8caa5411001b',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-ad-creative',
  'skill',
  'ad creative',
  'Agent skill: ad-creative',
  'repository',
  '.agents/skills/ad-creative/SKILL.md',
  '1.0.0',
  '14d3ff4c0f9e9965d746775d664d23e4',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-ads',
  'skill',
  'ads',
  'Agent skill: ads',
  'repository',
  '.agents/skills/ads/SKILL.md',
  '1.0.0',
  '07eb90ab466eee7c7de4e77b718b5a5f',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-agent-introspection-debugging',
  'skill',
  'agent introspection debugging',
  'Agent skill: agent-introspection-debugging',
  'repository',
  '.agents/skills/agent-introspection-debugging/SKILL.md',
  '1.0.0',
  '515b6050dce3ec8dd94d4059eceef9e0',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-agent-sort',
  'skill',
  'agent sort',
  'Agent skill: agent-sort',
  'repository',
  '.agents/skills/agent-sort/SKILL.md',
  '1.0.0',
  '60296dfbe99367a8b3827604a9b458c5',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-ai-seo',
  'skill',
  'ai seo',
  'Agent skill: ai-seo',
  'repository',
  '.agents/skills/ai-seo/SKILL.md',
  '1.0.0',
  'cf7a76cb5720e92e8944f497b0189bb1',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-analytics',
  'skill',
  'analytics',
  'Agent skill: analytics',
  'repository',
  '.agents/skills/analytics/SKILL.md',
  '1.0.0',
  'fdc5be4525cbc49e5e1d336bee7434f3',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-api-design',
  'skill',
  'api design',
  'Agent skill: api-design',
  'repository',
  '.agents/skills/api-design/SKILL.md',
  '1.0.0',
  '97f7222f381ea11fd90ca3bfe744e039',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-article-writing',
  'skill',
  'article writing',
  'Agent skill: article-writing',
  'repository',
  '.agents/skills/article-writing/SKILL.md',
  '1.0.0',
  '7faa959ea8c26d127547b84876b508d4',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-aso',
  'skill',
  'aso',
  'Agent skill: aso',
  'repository',
  '.agents/skills/aso/SKILL.md',
  '1.0.0',
  '01cb22f4675562dfb7088e6053346317',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-backend-patterns',
  'skill',
  'backend patterns',
  'Agent skill: backend-patterns',
  'repository',
  '.agents/skills/backend-patterns/SKILL.md',
  '1.0.0',
  '4c13243a31a80ccef3b3b17d5dce090d',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-banner-design',
  'skill',
  'banner design',
  'Agent skill: banner-design',
  'repository',
  '.agents/skills/banner-design/SKILL.md',
  '1.0.0',
  'aaf11854e0f8233bb53282699334164e',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-benchmark-methodology',
  'skill',
  'benchmark methodology',
  'Agent skill: benchmark-methodology',
  'repository',
  '.agents/skills/benchmark-methodology/SKILL.md',
  '1.0.0',
  '8c1f8f797bd30c6c8b7acd4630c998a7',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-brand',
  'skill',
  'brand',
  'Agent skill: brand',
  'repository',
  '.agents/skills/brand/SKILL.md',
  '1.0.0',
  '7d771c480a628d8abdd2749d1893c7ab',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-brand-discovery',
  'skill',
  'brand discovery',
  'Agent skill: brand-discovery',
  'repository',
  '.agents/skills/brand-discovery/SKILL.md',
  '1.0.0',
  '3ecb52e55c6256fe4fac8fc52c36bb52',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-brand-voice',
  'skill',
  'brand voice',
  'Agent skill: brand-voice',
  'repository',
  '.agents/skills/brand-voice/SKILL.md',
  '1.0.0',
  'b83f139a4d8883f5a20361f7fb55d5d9',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-bun-runtime',
  'skill',
  'bun runtime',
  'Agent skill: bun-runtime',
  'repository',
  '.agents/skills/bun-runtime/SKILL.md',
  '1.0.0',
  '6834fda0bb6dc6f600d1cdcaf5972a3b',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-churn-prevention',
  'skill',
  'churn prevention',
  'Agent skill: churn-prevention',
  'repository',
  '.agents/skills/churn-prevention/SKILL.md',
  '1.0.0',
  '436214e6e95e7fde9c82ce02eda1e62b',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-co-marketing',
  'skill',
  'co marketing',
  'Agent skill: co-marketing',
  'repository',
  '.agents/skills/co-marketing/SKILL.md',
  '1.0.0',
  'be05f2efe842415033c7c7c8f1781980',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-coding-standards',
  'skill',
  'coding standards',
  'Agent skill: coding-standards',
  'repository',
  '.agents/skills/coding-standards/SKILL.md',
  '1.0.0',
  'c6ec64d3ff00fffbba4616b62bea4f76',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-cold-email',
  'skill',
  'cold email',
  'Agent skill: cold-email',
  'repository',
  '.agents/skills/cold-email/SKILL.md',
  '1.0.0',
  '3862c75a4de66ea991b07b6e69e369be',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-community-marketing',
  'skill',
  'community marketing',
  'Agent skill: community-marketing',
  'repository',
  '.agents/skills/community-marketing/SKILL.md',
  '1.0.0',
  'ec1cbd21d57ab074511b08189d92c7ef',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-competitive-platform-analysis',
  'skill',
  'competitive platform analysis',
  'Agent skill: competitive-platform-analysis',
  'repository',
  '.agents/skills/competitive-platform-analysis/SKILL.md',
  '1.0.0',
  'd72a389c687c0a4fbdf6279d26fc15f5',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-competitive-report-structure',
  'skill',
  'competitive report structure',
  'Agent skill: competitive-report-structure',
  'repository',
  '.agents/skills/competitive-report-structure/SKILL.md',
  '1.0.0',
  'b5908e7decb1b1b5242c26586e3dd555',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-competitor-profiling',
  'skill',
  'competitor profiling',
  'Agent skill: competitor-profiling',
  'repository',
  '.agents/skills/competitor-profiling/SKILL.md',
  '1.0.0',
  'b816067ec19a7f48bda7a7d722bfc1a5',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-competitors',
  'skill',
  'competitors',
  'Agent skill: competitors',
  'repository',
  '.agents/skills/competitors/SKILL.md',
  '1.0.0',
  '265b5e234999644d65337c474fe6b3c3',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-content-engine',
  'skill',
  'content engine',
  'Agent skill: content-engine',
  'repository',
  '.agents/skills/content-engine/SKILL.md',
  '1.0.0',
  '62330c2be56251b8a9a1a7719fcb3599',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-content-strategy',
  'skill',
  'content strategy',
  'Agent skill: content-strategy',
  'repository',
  '.agents/skills/content-strategy/SKILL.md',
  '1.0.0',
  'df92708e151c26fb7575045161cde27d',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-copy-editing',
  'skill',
  'copy editing',
  'Agent skill: copy-editing',
  'repository',
  '.agents/skills/copy-editing/SKILL.md',
  '1.0.0',
  '42a13ec69f9088e6191bf3e665358fa1',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-copywriting',
  'skill',
  'copywriting',
  'Agent skill: copywriting',
  'repository',
  '.agents/skills/copywriting/SKILL.md',
  '1.0.0',
  '807d82a9b5ba008b4d6c1b040dfd7430',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-cro',
  'skill',
  'cro',
  'Agent skill: cro',
  'repository',
  '.agents/skills/cro/SKILL.md',
  '1.0.0',
  '70de95f960a2fd80edd339d83d925dba',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-crosspost',
  'skill',
  'crosspost',
  'Agent skill: crosspost',
  'repository',
  '.agents/skills/crosspost/SKILL.md',
  '1.0.0',
  '38c2c85d44642335695c8bf3db6e3b8e',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-customer-research',
  'skill',
  'customer research',
  'Agent skill: customer-research',
  'repository',
  '.agents/skills/customer-research/SKILL.md',
  '1.0.0',
  'fc0249de0f8fc989af91963e997162ab',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-deep-research',
  'skill',
  'deep research',
  'Agent skill: deep-research',
  'repository',
  '.agents/skills/deep-research/SKILL.md',
  '1.0.0',
  '613c71175a043852cc9d2335faf1589d',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-design',
  'skill',
  'design',
  'Agent skill: design',
  'repository',
  '.agents/skills/design/SKILL.md',
  '1.0.0',
  'd61b2326528cef1f0a8802c473840aa7',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-design-system',
  'skill',
  'design system',
  'Agent skill: design-system',
  'repository',
  '.agents/skills/design-system/SKILL.md',
  '1.0.0',
  '399b2e5ffbeac0bc777882e340245be9',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-directory-submissions',
  'skill',
  'directory submissions',
  'Agent skill: directory-submissions',
  'repository',
  '.agents/skills/directory-submissions/SKILL.md',
  '1.0.0',
  'fe1ebb4b9c57f3d18e82ac27944209de',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-dmux-workflows',
  'skill',
  'dmux workflows',
  'Agent skill: dmux-workflows',
  'repository',
  '.agents/skills/dmux-workflows/SKILL.md',
  '1.0.0',
  'f6a417be3ca516e0151f2a3c8bce6ef6',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-documentation-lookup',
  'skill',
  'documentation lookup',
  'Agent skill: documentation-lookup',
  'repository',
  '.agents/skills/documentation-lookup/SKILL.md',
  '1.0.0',
  '955faa6e07ec1c38d2f9d9c9a44b1f7c',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-e2e-testing',
  'skill',
  'e2e testing',
  'Agent skill: e2e-testing',
  'repository',
  '.agents/skills/e2e-testing/SKILL.md',
  '1.0.0',
  '096fc37d7cf9193bcc4045eccff09dc3',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-emails',
  'skill',
  'emails',
  'Agent skill: emails',
  'repository',
  '.agents/skills/emails/SKILL.md',
  '1.0.0',
  '5d8fff671f76248b1c1c4a5d5051a7ea',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-eval-harness',
  'skill',
  'eval harness',
  'Agent skill: eval-harness',
  'repository',
  '.agents/skills/eval-harness/SKILL.md',
  '1.0.0',
  '6f8056a24a85e80e3f9573008b5829c8',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-everything-claude-code',
  'skill',
  'everything claude code',
  'Agent skill: everything-claude-code',
  'repository',
  '.agents/skills/everything-claude-code/SKILL.md',
  '1.0.0',
  'e71f78edabeaf1eff373785479813e83',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-exa-search',
  'skill',
  'exa search',
  'Agent skill: exa-search',
  'repository',
  '.agents/skills/exa-search/SKILL.md',
  '1.0.0',
  '15c2fba00ab7997c8b997437e4741eb5',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-fal-ai-media',
  'skill',
  'fal ai media',
  'Agent skill: fal-ai-media',
  'repository',
  '.agents/skills/fal-ai-media/SKILL.md',
  '1.0.0',
  'ef881d83bc6173dbaf2c3db190c8978b',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-free-tools',
  'skill',
  'free tools',
  'Agent skill: free-tools',
  'repository',
  '.agents/skills/free-tools/SKILL.md',
  '1.0.0',
  'f625e821d1a6bbb713d0396f2575b5dc',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-frontend-patterns',
  'skill',
  'frontend patterns',
  'Agent skill: frontend-patterns',
  'repository',
  '.agents/skills/frontend-patterns/SKILL.md',
  '1.0.0',
  '17f00d02d33f43115108a40740f90c88',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-frontend-slides',
  'skill',
  'frontend slides',
  'Agent skill: frontend-slides',
  'repository',
  '.agents/skills/frontend-slides/SKILL.md',
  '1.0.0',
  '9a8623a3e6f17ba1776d26fddb749101',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-image',
  'skill',
  'image',
  'Agent skill: image',
  'repository',
  '.agents/skills/image/SKILL.md',
  '1.0.0',
  'a14ada4a4d36fab28d372ea6f5ae2879',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-investor-materials',
  'skill',
  'investor materials',
  'Agent skill: investor-materials',
  'repository',
  '.agents/skills/investor-materials/SKILL.md',
  '1.0.0',
  'dd5d001239cc39dc9581fdfa4afa1fd6',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-investor-outreach',
  'skill',
  'investor outreach',
  'Agent skill: investor-outreach',
  'repository',
  '.agents/skills/investor-outreach/SKILL.md',
  '1.0.0',
  '612fecee750cc57b91ef53118dd9dbd9',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-launch',
  'skill',
  'launch',
  'Agent skill: launch',
  'repository',
  '.agents/skills/launch/SKILL.md',
  '1.0.0',
  '86717a36ec781ca6501471a72d5b832f',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-lead-magnets',
  'skill',
  'lead magnets',
  'Agent skill: lead-magnets',
  'repository',
  '.agents/skills/lead-magnets/SKILL.md',
  '1.0.0',
  '7e9567f257583ca161e6ad25d15625f0',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-market-research',
  'skill',
  'market research',
  'Agent skill: market-research',
  'repository',
  '.agents/skills/market-research/SKILL.md',
  '1.0.0',
  '65b2529c964a395bbf176db255b0a6b2',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-marketing-council',
  'skill',
  'marketing council',
  'Agent skill: marketing-council',
  'repository',
  '.agents/skills/marketing-council/SKILL.md',
  '1.0.0',
  'd8540bfc655312ebdee09a45cc84f4e3',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-marketing-ideas',
  'skill',
  'marketing ideas',
  'Agent skill: marketing-ideas',
  'repository',
  '.agents/skills/marketing-ideas/SKILL.md',
  '1.0.0',
  '1830b8d95e7b4f18ba235a19253719ed',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-marketing-loops',
  'skill',
  'marketing loops',
  'Agent skill: marketing-loops',
  'repository',
  '.agents/skills/marketing-loops/SKILL.md',
  '1.0.0',
  'd0baafa66294e6df8a7d991789f7f915',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-marketing-plan',
  'skill',
  'marketing plan',
  'Agent skill: marketing-plan',
  'repository',
  '.agents/skills/marketing-plan/SKILL.md',
  '1.0.0',
  'aaf39461f81118b9d2f9d1c17efc6201',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-marketing-psychology',
  'skill',
  'marketing psychology',
  'Agent skill: marketing-psychology',
  'repository',
  '.agents/skills/marketing-psychology/SKILL.md',
  '1.0.0',
  'bf1744b50baf996dfd17a15aa68ada66',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-mcp-server-patterns',
  'skill',
  'mcp server patterns',
  'Agent skill: mcp-server-patterns',
  'repository',
  '.agents/skills/mcp-server-patterns/SKILL.md',
  '1.0.0',
  '8ca644b691c70f47db4c9a64815d3067',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-mle-workflow',
  'skill',
  'mle workflow',
  'Agent skill: mle-workflow',
  'repository',
  '.agents/skills/mle-workflow/SKILL.md',
  '1.0.0',
  '5ec158ef8dfc275c5fe959746c37f6c3',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-nextjs-turbopack',
  'skill',
  'nextjs turbopack',
  'Agent skill: nextjs-turbopack',
  'repository',
  '.agents/skills/nextjs-turbopack/SKILL.md',
  '1.0.0',
  'f46d95747f33e901d1ffce5633f8a532',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-offers',
  'skill',
  'offers',
  'Agent skill: offers',
  'repository',
  '.agents/skills/offers/SKILL.md',
  '1.0.0',
  'e689385ae8c1d9b1885ca5f2d04f6ea6',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-onboarding',
  'skill',
  'onboarding',
  'Agent skill: onboarding',
  'repository',
  '.agents/skills/onboarding/SKILL.md',
  '1.0.0',
  'ea0cacc6ace89012974e55cb62f1f203',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-paywalls',
  'skill',
  'paywalls',
  'Agent skill: paywalls',
  'repository',
  '.agents/skills/paywalls/SKILL.md',
  '1.0.0',
  '1e7d25731964ba82666ba341821571dc',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-plan-canvas',
  'skill',
  'plan canvas',
  'Agent skill: plan-canvas',
  'repository',
  '.agents/skills/plan-canvas/SKILL.md',
  '1.0.0',
  'b3d100fb445be548bd15819eb7c5ab22',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-popups',
  'skill',
  'popups',
  'Agent skill: popups',
  'repository',
  '.agents/skills/popups/SKILL.md',
  '1.0.0',
  '26186a79800388628ae26a6dfef3fe05',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-pricing',
  'skill',
  'pricing',
  'Agent skill: pricing',
  'repository',
  '.agents/skills/pricing/SKILL.md',
  '1.0.0',
  'bbea67d48d177a523f9889dbb3a67888',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-product-capability',
  'skill',
  'product capability',
  'Agent skill: product-capability',
  'repository',
  '.agents/skills/product-capability/SKILL.md',
  '1.0.0',
  'c9f0d7cfa998443935ff1cea17419fbc',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-product-marketing',
  'skill',
  'product marketing',
  'Agent skill: product-marketing',
  'repository',
  '.agents/skills/product-marketing/SKILL.md',
  '1.0.0',
  'e4576c57a806f2c410696ca897f9df4a',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-programmatic-seo',
  'skill',
  'programmatic seo',
  'Agent skill: programmatic-seo',
  'repository',
  '.agents/skills/programmatic-seo/SKILL.md',
  '1.0.0',
  'ed76e42812e476ad77484a97bc2dc680',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-prospecting',
  'skill',
  'prospecting',
  'Agent skill: prospecting',
  'repository',
  '.agents/skills/prospecting/SKILL.md',
  '1.0.0',
  'c25430f8e4fcdadbf4d904be9ed464fe',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-public-relations',
  'skill',
  'public relations',
  'Agent skill: public-relations',
  'repository',
  '.agents/skills/public-relations/SKILL.md',
  '1.0.0',
  '78eef5903c745e4c61a941ab35c210f5',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-referrals',
  'skill',
  'referrals',
  'Agent skill: referrals',
  'repository',
  '.agents/skills/referrals/SKILL.md',
  '1.0.0',
  '9b179d13f9db45fc92aeb0b69d3aafb0',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-revops',
  'skill',
  'revops',
  'Agent skill: revops',
  'repository',
  '.agents/skills/revops/SKILL.md',
  '1.0.0',
  '9423b113ded6d74492589a0cc2d35b5a',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-sales-enablement',
  'skill',
  'sales enablement',
  'Agent skill: sales-enablement',
  'repository',
  '.agents/skills/sales-enablement/SKILL.md',
  '1.0.0',
  '7cbbb78439188587cc17f336f28f9537',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-schema',
  'skill',
  'schema',
  'Agent skill: schema',
  'repository',
  '.agents/skills/schema/SKILL.md',
  '1.0.0',
  '0ffff0f67407232221704886b4cf43df',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-scroll-world',
  'skill',
  'scroll world',
  'Agent skill: scroll-world',
  'repository',
  '.agents/skills/scroll-world/SKILL.md',
  '1.0.0',
  '2533820afb9fb9c04a703f92f201ce6c',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-security-review',
  'skill',
  'security review',
  'Agent skill: security-review',
  'repository',
  '.agents/skills/security-review/SKILL.md',
  '1.0.0',
  '94abab4586cd2c13cd47a1d146d2fae2',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-seo-audit',
  'skill',
  'seo audit',
  'Agent skill: seo-audit',
  'repository',
  '.agents/skills/seo-audit/SKILL.md',
  '1.0.0',
  'b8532581b6992bc2e1031acd9622e492',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-signup',
  'skill',
  'signup',
  'Agent skill: signup',
  'repository',
  '.agents/skills/signup/SKILL.md',
  '1.0.0',
  'abdb0d0371cfac7b39f84b97d13a19a4',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-site-architecture',
  'skill',
  'site architecture',
  'Agent skill: site-architecture',
  'repository',
  '.agents/skills/site-architecture/SKILL.md',
  '1.0.0',
  '641b42939ba072cb62bb76ac48435ea2',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-slides',
  'skill',
  'slides',
  'Agent skill: slides',
  'repository',
  '.agents/skills/slides/SKILL.md',
  '1.0.0',
  '1d017fa64446b147cb7c84f05562520f',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-sms',
  'skill',
  'sms',
  'Agent skill: sms',
  'repository',
  '.agents/skills/sms/SKILL.md',
  '1.0.0',
  '17b235b5d0457f7c79c56b6438164c12',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-social',
  'skill',
  'social',
  'Agent skill: social',
  'repository',
  '.agents/skills/social/SKILL.md',
  '1.0.0',
  '954400545d2f5f3c5f95a5b93ca5120c',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-strategic-compact',
  'skill',
  'strategic compact',
  'Agent skill: strategic-compact',
  'repository',
  '.agents/skills/strategic-compact/SKILL.md',
  '1.0.0',
  '6732ab605fc859c891ec743ccbc2bbc1',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-tdd-workflow',
  'skill',
  'tdd workflow',
  'Agent skill: tdd-workflow',
  'repository',
  '.agents/skills/tdd-workflow/SKILL.md',
  '1.0.0',
  '168ede3fa253873546a69096116207a0',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-ui-styling',
  'skill',
  'ui styling',
  'Agent skill: ui-styling',
  'repository',
  '.agents/skills/ui-styling/SKILL.md',
  '1.0.0',
  '28a3c5ed8e63a04595cc398a355a3b63',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-ui-ux-pro-max',
  'skill',
  'ui ux pro max',
  'Agent skill: ui-ux-pro-max',
  'repository',
  '.agents/skills/ui-ux-pro-max/SKILL.md',
  '1.0.0',
  '088e3bb6113cd51e92773c8907957614',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-verification-loop',
  'skill',
  'verification loop',
  'Agent skill: verification-loop',
  'repository',
  '.agents/skills/verification-loop/SKILL.md',
  '1.0.0',
  '59d47d464e141561a66eb686c7e5b041',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-video',
  'skill',
  'video',
  'Agent skill: video',
  'repository',
  '.agents/skills/video/SKILL.md',
  '1.0.0',
  '2f249156340558c1fceb3bd2cc40be86',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-video-editing',
  'skill',
  'video editing',
  'Agent skill: video-editing',
  'repository',
  '.agents/skills/video-editing/SKILL.md',
  '1.0.0',
  '0f2ef572d41376f6aa5622c73faf5ccd',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

INSERT INTO dev_artifacts (stable_key, artifact_type, name, description, source_type, source_path, version, checksum, scope, status, mandatory, trigger_conditions, last_indexed_at)
VALUES (
  'skill-x-api',
  'skill',
  'x api',
  'Agent skill: x-api',
  'repository',
  '.agents/skills/x-api/SKILL.md',
  '1.0.0',
  '5d0c85183a13e0fd9d77edff7072a950',
  'global',
  'active',
  false,
  '{"tech_stacks":["all"]}'::jsonb,
  NOW()
) ON CONFLICT (stable_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source_path = EXCLUDED.source_path,
  version = EXCLUDED.version,
  checksum = EXCLUDED.checksum,
  trigger_conditions = EXCLUDED.trigger_conditions,
  last_indexed_at = EXCLUDED.last_indexed_at;

