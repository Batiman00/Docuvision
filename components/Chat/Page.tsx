'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Image as ImageIcon } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { Progress } from '@/components/ui/progress';
import { AlertErrorMessage } from '../AlertErrorMessage/page';

interface Message {
  id: number;
  text: string;
  type: 'bot' | 'user';
  image?: string | null;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! How can I help you today?', type: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  const handleSend = () => {
    if (!input.trim() && !image) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, type: 'user', image: image ? URL.createObjectURL(image) : null },
    ]);
    setInput('');
    setImage(null);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: 'Thank you for your message!', type: 'bot' },
      ]);
    }, 1000);
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    setIsLoading(true);
    setProgress(0);
  
    try {
        if (file.type.startsWith("image/")) {
        const title = file.name
        const text = await Tesseract.recognize(file, "eng", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(m.progress * 100);
            }
          },
        }).then(({ data: { text } }) => text);
  
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: "Tell me what the text in the image of this document says : " + title, type: "user" },
          { id: Date.now() + 2, text: text, type: "bot" },
        ]);
        setOcrText(text);
        
      }else{
        setShowErrorAlert(true)
        setErrorMessage("Only image files are supported!");
      }
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Card className="w-full shadow-md h-[90%]">
        <AlertErrorMessage message={errorMessage} open={showErrorAlert} displayFunction={setShowErrorAlert} />
      <CardHeader className="h-[10%]">
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[85%]">
        <ScrollArea className="flex-grow border rounded p-2 mb-2 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 p-2 rounded ${
                message.type === 'bot' ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'
              }`}
            >
              {message.text}
              {message.image && <img src={message.image} alt="Uploaded" className="mt-2 w-full h-auto rounded" />}
            </div>
          ))}
        </ScrollArea>
        <Progress value={progress} className={isLoading ? '' : 'hidden'} />
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSend} className="flex items-center gap-1">
            <Send size={16} /> Send
          </Button>
          <Button className="flex items-center gap-1" onClick={triggerFileInput}>
            <ImageIcon size={16} /> Upload File
          </Button>
          <input
            id="file-upload"
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </CardContent>
      <CardFooter className="h-[5%]">Download Content</CardFooter>
    </Card>
  );
}
