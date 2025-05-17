const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('baileys');
const P = require('pino');
const handler = require('./messageHandler');

const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startSock() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: 'silent' })
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        if (!messages[0].message) return;
        await handler(sock, messages[0]);
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                startSock();
            }
        } else if (connection === 'open') {
            console.log('✅ Bot başarıyla bağlandı!');
        }
    });

    sock.ev.on('creds.update', saveState);
}

startSock();
