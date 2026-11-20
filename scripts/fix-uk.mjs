import fs from 'node:fs/promises';

const translationPath = new URL('../translations/uk.json', import.meta.url);
const sourcePath = new URL('../catalogue/filex-catalogue-en.json', import.meta.url);
const translation = JSON.parse(await fs.readFile(translationPath, 'utf8'));
const source = JSON.parse(await fs.readFile(sourcePath, 'utf8'));

Object.assign(translation, {
  'appPlugins.fields.state': 'Статус',
  'appPlugins.setup.addr.colState': 'Статус',
  'plugins.fields.state': 'Статус',
  'sync.fields.state': 'Статус',
  'tenantSelf.domainStatus': 'Статус',
  'tenants.stateColumn': 'Статус',
  'login.realm': 'Область входу',
  'login.realmHint': 'Назва вашої організації для входу. Для входу з локальним обліковим записом сервера залиште поле порожнім.',
  'login.realmLocked': 'Ця адреса належить до області входу {realm}.',
  'server.auth_provider.test_realm_required': 'Цей постачальник обслуговує кілька організацій. Укажіть область входу тестового облікового запису.',
  'server.auth_provider.test_realm_unknown': 'Організації з такою областю входу немає.',
  'tenants.errors.realm_empty': 'Для організації потрібна область входу.',
  'tenants.errors.realm_immutable': 'Область входу не можна змінити.',
  'tenants.errors.realm_invalid': 'Лише малі латинські літери, цифри та дефіси; не більше 63 символів. Перший і останній символи мають бути літерою або цифрою.',
  'tenants.errors.realm_none': 'Із цього ідентифікатора неможливо сформувати область входу. Введіть її вручну.',
  'tenants.errors.realm_reserved': 'Цю область входу зарезервовано.',
  'tenants.errors.realm_taken': 'Таку область входу вже використовує інша організація.',
  'tenants.fields.realm': 'Область входу',
  'tenants.fields.slug': 'Ідентифікатор',
  'tenants.errors.slug_taken': 'Такий ідентифікатор уже використовує інша організація.',
  'tenants.fields.slugEditHint': 'Його зміна не змінює область входу.',
  'tenants.fields.slugHint': 'Короткий унікальний ідентифікатор організації на цій платформі. На його основі пропонується область входу.',
  'tenants.platformRealm': 'Немає: порожня область входу',
  'tenants.platformRealmHint': 'Власна організація платформи не має області входу: її користувачі залишають поле «Область входу» порожнім.',
  'tenants.realmSuggesting': 'Добирається область входу…',
  'tenantSelf.signinHint': 'Власний постачальник OIDC або LDAP організації. Її користувачі входять через нього, указуючи область входу; користувачі інших організацій не можуть ним скористатися.',
  'tenants.fields.hostHint': 'Хост організації (наприклад, files.acme.example). На його сторінці входу вже вказано організацію, тому користувачам не потрібно вводити область входу. Якщо поле порожнє, вони входять за адресою платформи та вказують свою область входу.',
  'tenants.realmSuggestedHint': `Запропоновано на основі ідентифікатора; зараз значення можна змінити. Після створення організації область входу змінити не можна: вона входить до адрес облікових записів (alex{'@'}realm.local) та імен користувачів у застосунках (realm/alex).`,
  'conn.guide.s3.fact.bucket': 'Бакет',
  'storages.fields.bucket': 'Бакет',
  'usage.buckets.bucket': 'Бакет',
  'usage.buckets.title': 'За бакетами',
  'conn.s3keys.everyBucket': 'Усі доступні мені бакети',
  'conn.guide.mount.win.freeLetter': 'Виберіть вільну літеру диска. Підключення створює новий диск; якщо літеру вже зайнято, команда завершиться помилкою, яка не завжди чітко вказує причину.'
});

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
