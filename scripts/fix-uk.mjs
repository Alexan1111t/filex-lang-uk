import fs from 'node:fs/promises';

const translationPath = new URL('../translations/uk.json', import.meta.url);
const sourcePath = new URL('../catalogue/filex-catalogue-en.json', import.meta.url);
const translation = JSON.parse(await fs.readFile(translationPath, 'utf8'));
const source = JSON.parse(await fs.readFile(sourcePath, 'utf8'));

for (const key of Object.keys(translation)) {
  translation[key] = translation[key].replace(/[\u2010-\u2015\u2212]/g, '-');
}

const preserveExactly = [
  'server.auth_provider.pam_hint_accepts_anyone',
  'server.auth_provider.pam_hint_pam_broken',
  'server.auth_provider.pam_hint_pam_service_missing',
  'server.auth_provider.pam_hint_pamtester_missing',
  'server.auth_provider.pam_hint_pamtester_not_executable',
  'server.auth_provider.pam_hint_sudo_missing',
  'server.auth_provider.pam_hint_sudo_not_allowed',
  'server.auth_provider.pam_hint_sudo_password_required',
  'server.auth_provider.pam_hint_sudo_requiretty',
  'server.auth_provider.pam_hint_test_account_wrong',
  'server.list.separator',
];

for (const key of preserveExactly) translation[key] = source[key];

await fs.writeFile(translationPath, JSON.stringify(translation, null, 2) + '\n');
