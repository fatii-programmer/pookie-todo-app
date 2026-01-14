#!/usr/bin/env node

/**
 * Automated Environment Setup - FIXED VERSION
 *
 * Creates .env.local from template and validates configuration
 * Ensures all required folders exist
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`   CREATED: ${dir}/`);
    return true;
  }
  console.log(`   EXISTS: ${dir}/`);
  return false;
}

async function setup() {
  console.log('\n' + '='.repeat(60));
  console.log('   CHATBOT ENVIRONMENT SETUP WIZARD');
  console.log('='.repeat(60) + '\n');

  let needsRestart = false;

  // Step 1: Check for .env.local
  console.log('STEP 1: Environment File (.env.local)');
  console.log('-'.repeat(60));

  if (fs.existsSync('.env.local')) {
    console.log('INFO: .env.local already exists\n');

    // Check if it has a valid API key
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    const hasValidKey = envContent.match(/OPENAI_API_KEY=sk-[A-Za-z0-9_-]+/) &&
                        !envContent.includes('REPLACE-WITH') &&
                        !envContent.includes('your-');

    if (hasValidKey) {
      console.log('GOOD: API key appears to be configured');
      console.log('Skipping environment setup...\n');
    } else {
      console.log('WARNING: API key appears to be missing or invalid');
      const reconfigure = await question('Reconfigure .env.local? (y/N): ');
      if (reconfigure.toLowerCase() !== 'y') {
        console.log('Skipping environment setup...\n');
        needsRestart = false;
      } else {
        needsRestart = true;
        await configureEnvironment();
      }
    }
  } else {
    console.log('INFO: .env.local does NOT exist');
    console.log('Creating from template...\n');
    needsRestart = true;
    await configureEnvironment();
  }

  // Step 2: Create history folders
  console.log('\nSTEP 2: History Folders');
  console.log('-'.repeat(60));

  const historyDirs = [
    'history',
    'history/users',
    'history/chatbot',
    'history/rag',
    'history/chat',        // Explicitly for chat logs
    'history/operations'   // Explicitly for operation logs
  ];

  historyDirs.forEach(dir => ensureDir(dir));

  // Create .gitkeep files to preserve empty folders
  historyDirs.forEach(dir => {
    const gitkeepPath = path.join(dir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '');
    }
  });

  console.log('\n   All history folders ready!\n');

  // Step 3: Validate configuration
  console.log('STEP 3: Validation');
  console.log('-'.repeat(60));

  const errors = [];
  const warnings = [];

  if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf-8');

    // Check OpenAI API key
    if (!envContent.includes('OPENAI_API_KEY=sk-')) {
      errors.push('OPENAI_API_KEY is not set or invalid');
    } else if (envContent.includes('REPLACE-WITH') || envContent.includes('your-')) {
      errors.push('OPENAI_API_KEY is still a placeholder');
    } else {
      console.log('   PASS: OpenAI API key configured');
    }

    // Check JWT secret
    if (!envContent.match(/JWT_SECRET=.{20,}/)) {
      warnings.push('JWT_SECRET may be too short or missing');
    } else if (envContent.includes('REPLACE-WITH') || envContent.includes('your-')) {
      warnings.push('JWT_SECRET appears to be a placeholder');
    } else {
      console.log('   PASS: JWT secret configured');
    }
  } else {
    errors.push('.env.local file is missing');
  }

  console.log('');

  // Step 4: Summary
  console.log('='.repeat(60));
  console.log('SETUP SUMMARY');
  console.log('='.repeat(60) + '\n');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('SUCCESS: All checks passed!\n');

    console.log('NEXT STEPS:');
    if (needsRestart) {
      console.log('1. Restart the dev server (if running):');
      console.log('   Press Ctrl+C, then run: npm run dev\n');
    } else {
      console.log('1. Start the dev server:');
      console.log('   npm run dev\n');
    }
    console.log('2. Open http://localhost:3000\n');
    console.log('3. Login and click the chat button (💬)\n');
    console.log('4. Try: "add task: buy milk"\n');

  } else {
    if (errors.length > 0) {
      console.log('ERRORS (must fix):');
      errors.forEach(e => console.log(`  ❌ ${e}`));
      console.log('');
    }

    if (warnings.length > 0) {
      console.log('WARNINGS:');
      warnings.forEach(w => console.log(`  ⚠️  ${w}`));
      console.log('');
    }

    console.log('FIX INSTRUCTIONS:');
    console.log('1. Edit .env.local');
    console.log('2. Add your OpenAI API key from: https://platform.openai.com/api-keys');
    console.log('3. Replace: OPENAI_API_KEY=sk-proj-REPLACE-WITH...');
    console.log('4. With:    OPENAI_API_KEY=sk-proj-your-actual-key\n');
    console.log('5. Generate JWT secret:');
    console.log('   node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"\n');
    console.log('6. Run this script again to verify\n');
  }

  rl.close();
  process.exit(errors.length > 0 ? 1 : 0);
}

async function configureEnvironment() {
  // Copy template
  if (!fs.existsSync('.env.local.example')) {
    console.log('ERROR: .env.local.example not found!');
    console.log('Cannot create .env.local without template.\n');
    return;
  }

  const template = fs.readFileSync('.env.local.example', 'utf-8');
  fs.writeFileSync('.env.local', template);
  console.log('   CREATED: .env.local (from template)\n');

  // Get OpenAI API key
  console.log('OpenAI API Key Configuration');
  console.log('Visit: https://platform.openai.com/api-keys');
  console.log('Click: "Create new secret key"');
  console.log('Copy the key (starts with sk-)\n');

  const apiKey = await question('Paste your OpenAI API key (or press Enter to skip): ');

  if (apiKey.trim()) {
    if (apiKey.startsWith('sk-')) {
      let envContent = fs.readFileSync('.env.local', 'utf-8');
      envContent = envContent.replace(
        /OPENAI_API_KEY=.*/,
        `OPENAI_API_KEY=${apiKey.trim()}`
      );
      fs.writeFileSync('.env.local', envContent);
      console.log('   SAVED: API key configured\n');
    } else {
      console.log('   WARNING: Key doesn\'t start with sk- (may be invalid)\n');
      console.log('   You can edit .env.local manually later\n');
    }
  } else {
    console.log('   SKIPPED: Add API key manually to .env.local\n');
  }

  // Generate JWT secret
  console.log('Generating JWT secret...');
  try {
    const jwtSecret = execSync(
      'node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
      { encoding: 'utf-8' }
    ).trim();

    let envContent = fs.readFileSync('.env.local', 'utf-8');
    envContent = envContent.replace(
      /JWT_SECRET=.*/,
      `JWT_SECRET=${jwtSecret}`
    );
    fs.writeFileSync('.env.local', envContent);
    console.log('   GENERATED: JWT secret created\n');
  } catch (error) {
    console.log('   ERROR: Could not generate JWT secret');
    console.log('   You\'ll need to add this manually\n');
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nSetup cancelled by user\n');
  rl.close();
  process.exit(1);
});

// Run setup
setup().catch(error => {
  console.error('\nSetup failed with error:');
  console.error(error);
  rl.close();
  process.exit(1);
});
