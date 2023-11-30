export class UserUserEvent {
    senderId: number;
    receiverId: number;
    eventId: number;
    confirmed: boolean;
    cost: number;
    paid: boolean;
    userUserEventActive: boolean;
    userUserEventCreation: Date;
    userUserEventRemoval: Date;
}