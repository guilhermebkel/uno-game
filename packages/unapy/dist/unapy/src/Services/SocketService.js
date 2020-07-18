"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Socket_1 = require("@unapy/Core/Socket");
class SocketService {
    emitRoomEvent(roomId, event, data) {
        Socket_1.io.to(roomId).emit(event, data);
    }
}
exports.default = new SocketService();
//# sourceMappingURL=SocketService.js.map