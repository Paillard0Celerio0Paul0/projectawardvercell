const { createServer } = require('http');
const { Server: ServerIO } = require('socket.io');

const ROOM_ID = 'gorki-awards-2025';
const participants = new Map();

function initServer() {
  if (!global.httpServer) {
    console.log('Initialisation du serveur HTTP...');
    const httpServer = createServer();
    global.httpServer = httpServer;

    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
      transports: ['websocket'],
      pingTimeout: 60000,
      pingInterval: 25000,
      connectTimeout: 20000
    });

    io.on('connection', (socket) => {
      console.log('Nouvelle connexion Socket.IO:', socket.id);
      const { userId, guildId, name, image } = socket.handshake.query;

      console.log('Informations de connexion:', {
        userId,
        guildId,
        name,
        image
      });

      // Vérifier que l'utilisateur appartient au bon serveur Discord
      if (guildId !== process.env.NEXT_PUBLIC_DISCORD_GUILD_ID) {
        console.log('Connexion refusée: mauvais serveur Discord');
        socket.disconnect();
        return;
      }

      // Rejoindre la room globale
      socket.join(ROOM_ID);
      console.log(`Utilisateur ${userId} a rejoint la room ${ROOM_ID}`);

      // Ajouter le participant à la liste
      participants.set(socket.id, {
        id: userId,
        socketId: socket.id,
        name,
        image
      });

      console.log('Participant ajouté:', userId);
      console.log('Nombre total de participants:', participants.size);

      // Envoyer la liste mise à jour à tous les clients de la room
      io.to(ROOM_ID).emit('participants:update', Array.from(participants.values()));

      // Gérer la déconnexion
      socket.on('disconnect', () => {
        console.log('Déconnexion:', socket.id);
        participants.delete(socket.id);
        console.log('Nombre total de participants après déconnexion:', participants.size);
        io.to(ROOM_ID).emit('participants:update', Array.from(participants.values()));
      });

      // Gérer les erreurs
      socket.on('error', (error) => {
        console.error('Erreur Socket.IO:', error);
      });
    });

    global.io = io;

    httpServer.listen(3001, () => {
      console.log('Server running on port 3001');
    });
  }
}

module.exports = { initServer }; 