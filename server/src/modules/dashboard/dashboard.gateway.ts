import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IDashboardData, IDashboardUpdate } from './dashboard.dto';
import { DashboardService } from './dashboard.service';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';

const DASHBOARD_ROOM = 'dashboard:subscribers';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/dashboard',
})
export class DashboardGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly dashboardService: DashboardService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  async handleConnection(client: Socket) {
    this.logger.info(`Client connected: ${client.id}`);
    await this.handleGetData(client);
  }

  async handleDisconnect(client: Socket) {
    this.logger.info(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('dashboard:subscribe')
  async handleSubscribe(@ConnectedSocket() client: Socket) {
    await client.join(DASHBOARD_ROOM);
    await this.handleGetData(client);
    return { success: true };
  }

  @SubscribeMessage('dashboard:unsubscribe')
  async handleUnsubscribe(@ConnectedSocket() client: Socket) {
    await client.leave(DASHBOARD_ROOM);
    return { success: true };
  }

  @SubscribeMessage('dashboard:getData')
  async handleGetData(@ConnectedSocket() client: Socket) {
    const data = await this.dashboardService.getDashboardData();
    await client.emit('dashboard:data', data);
    return { success: true };
  }

  @SubscribeMessage('dashboard:refresh')
  async handleRefresh() {
    const data = await this.dashboardService.refreshDashboardData();
    await this.broadcastDashboardData(data);
    return { success: true };
  }

  broadcastDashboardData(data: IDashboardData) {
    this.server.to(DASHBOARD_ROOM).emit('dashboard:data', data);
  }

  broadcastDashboardUpdate(update: IDashboardUpdate) {
    this.server.to(DASHBOARD_ROOM).emit('dashboard:update', update);
  }

  triggerDashboardUpdate() {
    this.handleRefresh();
  }
}
