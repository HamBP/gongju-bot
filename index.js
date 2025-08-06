require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const command = new SlashCommandBuilder()
    .setName('내부테스터')
    .setDescription('GitHub Actions를 실행하여 내부 테스트 배포합니다.')
    .addStringOption(option =>
        option.setName('version_code')
            .setDescription('버전 코드')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('version_name')
            .setDescription('버전 이름')
            .setRequired(true));

client.once('ready', async () => {
    console.log(`🟢 Logged in as ${client.user.tag}`);

    // 커맨드 등록
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    const appId = (await rest.get(Routes.currentApplication())).id;

    await rest.put(
        Routes.applicationCommands(appId),
        { body: [command.toJSON()] }
    );

    console.log('✅ Slash command registered');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== '내부테스터') return;

    const versionCode = interaction.options.getString('version_code');
    const versionName = interaction.options.getString('version_name');

    try {
        await interaction.reply(`🔄 GitHub Actions 트리거 중...\n버전 코드: ${versionCode}\n버전 이름: ${versionName}`);

        const payload = {
            ref: process.env.GITHUB_REF,
            inputs: {
                version_code: versionCode,
                version_name: versionName
            }
        };

        await axios.post(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/workflows/${process.env.GITHUB_WORKFLOW_FILE}/dispatches`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            }
        );

        await interaction.followUp('✅ GitHub Actions 트리거 완료!');
    } catch (err) {
        console.error(err.response?.data || err);
        await interaction.followUp(`❌ 트리거 실패: ${err.response?.data?.message || err.message}`);
    }
});

client.login(process.env.DISCORD_TOKEN);
