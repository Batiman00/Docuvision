export interface Chat {
    id: string;
    title: string;
    messages : Message[];
}
export interface Message {
    id: number;
    text: string;
    type: 'bot' | 'user';
}