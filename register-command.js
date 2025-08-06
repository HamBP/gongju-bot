require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

// 커맨드 정의
const commands = [
    new SlashCommandBuilder()
        .setName('내부테스터')
        .setDescription('GitHub Actions를 실행하여 내부 테스트 배포합니다.')
        .addStringOption(option =>
            option.setName('version_code').setDescription('버전 코드').setRequired(true))
        .addStringOption(option =>
            option.setName('version_name').setDescription('버전 이름').setRequired(true))
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🔁 슬래시 커맨드 등록 중...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('✅ 테스트 서버에만 커맨드 등록 완료!');
    } catch (error) {
        console.error('❌ 등록 실패:', error);
    }
})();
