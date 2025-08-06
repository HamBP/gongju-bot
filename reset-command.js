const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🧹 기존 커맨드 삭제 중...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: [] } // 빈 배열 = 기존 명령어 모두 제거
        );

        console.log('✅ 길드 명령어 초기화 완료');
    } catch (err) {
        console.error('❌ 삭제 실패:', err);
    }
})();
