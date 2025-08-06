require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`🟢 Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== '내부테스터') return;

    const versionCode = interaction.options.getString('version_code');
    const versionName = interaction.options.getString('version_name');

    try {
        await interaction.reply(`🔄 GitHub Actions 실행 중...\nversionCode=${versionCode}, versionName=${versionName}`);

        await axios.post(
            `https://api.github.com/repos/Nexters/NewsLetter-Android/actions/workflows/internal-release.yml/dispatches`,
            {
                ref: 'refs/heads/chore/60',
                inputs: {
                    version_code: versionCode,
                    version_name: versionName
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            }
        );

        await interaction.followUp('✅ GitHub Actions 트리거 완료');
    } catch (err) {
        console.error(err.response?.data || err);
        await interaction.followUp(`❌ 실패: ${err.response?.data?.message || err.message}`);
    }
});

client.login(process.env.DISCORD_TOKEN);
