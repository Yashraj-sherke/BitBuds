import logger from '../utils/logger.js';

const MASCOT_TIPS = {
  drag_fail: {
    mascotState: 'think',
    tip: 'Try dragging variables to match their labels!',
  },
  syntax_error: {
    mascotState: 'concerned',
    tip: 'Check your spelling — every letter and symbol matters in code!',
  },
  loop_confusion: {
    mascotState: 'explain',
    tip: 'Loops repeat actions! Wrap the blocks you want to repeat inside a loop block.',
  },
  variable_mismatch: {
    mascotState: 'think',
    tip: 'Make sure your variable names match exactly — code is case-sensitive!',
  },
  test_fail: {
    mascotState: 'encourage',
    tip: 'Almost there! Read the expected output and trace through your code step by step.',
  },
  idle: {
    mascotState: 'wave',
    tip: 'Need help? Click the hint button or ask me anything!',
  },
  mission_start: {
    mascotState: 'excited',
    tip: 'You got this! Start with the code template and run the tests when ready.',
  },
  level_up: {
    mascotState: 'celebrate',
    tip: 'Amazing work! You leveled up — keep the streak going!',
  },
};

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info('Socket client connected', { socketId: socket.id });

    socket.on('student:action', (payload = {}) => {
      const action = payload.action || 'idle';
      const response = MASCOT_TIPS[action] || MASCOT_TIPS.idle;

      socket.emit('mascot:response', {
        action,
        ...response,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('join:user', ({ userId }) => {
      if (userId) {
        socket.join(`user:${userId}`);
        logger.info('User joined socket room', { userId, socketId: socket.id });
      }
    });

    socket.on('disconnect', () => {
      logger.info('Socket client disconnected', { socketId: socket.id });
    });
  });
};

export const emitToUser = (io, userId, event, data) => {
  if (!io || !userId) return;
  io.to(`user:${userId}`).emit(event, data);
};

export default initSocket;
