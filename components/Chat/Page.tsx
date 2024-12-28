import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Image as ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AlertErrorMessage } from '../AlertErrorMessage/page';
import jsPDF from 'jspdf';
import { useUserContext } from '@/contexts/UserContext';
import Markdown from 'markdown-to-jsx';
import { fetchChats, getMessages } from '@/services/chatService';

interface ChatProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Chat({
  isLoading,
  setIsLoading,
}: ChatProps) {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const { chat, setChat, setChats } = useUserContext()


  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 10; // Margin from left and right
    const pageWidth = doc.internal.pageSize.width - margin; // Width available for text
    const lineHeight = 8; // Line height
    let yPosition = 10; // Starting Y position for text

    doc.setFontSize(9);
    chat.messages.forEach((message) => {
      const text = `${message.type === 'bot' ? 'Bot' : 'User'}: ${message.text}`;
      const textLines = doc.splitTextToSize(text, pageWidth);

      textLines.forEach((line: string) => {
        if (yPosition > doc.internal.pageSize.height - margin) {
          doc.addPage();
          yPosition = margin;
        }
        if (message.type === 'user') {
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setFont('helvetica', 'normal');
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += lineHeight / 2;
    });

    doc.save('chat-messages.pdf');
  };



  const handleSubmit = async () => {
    const session = await getSession();
    if (!input.trim() && !image) return;

    setIsLoading(true);
    setProgress(0);

    if (image && !image.type.startsWith('image/')) {
      setShowErrorAlert(true);
      setErrorMessage('Only image files are supported!');
      return;
    }

    try {
      const formData = new FormData();
      if (image) {
        formData.append('file', image);
      }
      formData.append('chatId', chat.id);
      formData.append('prompt', input === null ? '' : input);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/ocr`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      const response = await res.json();
      if (!res.ok) {
        setErrorMessage(response.message || 'Error processing image');
        setShowErrorAlert(true);
      } else {
        if (response?.data?.chat?.id) {
          const chatInfo = await getMessages(response.data.chat.id)
          if (!chat.id) {
            const chatList = await fetchChats()
            setChats(chatList)
          }
          setChat(chatInfo.chat)
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setErrorMessage('Something went wrong!' + String(error));
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
      setInput('');
      setImage(null);
    }
  };

  return (
    <Card className="w-full h-full sm:h-[90%]  bg-stone-100 min-w-[320px]">
      <AlertErrorMessage
        message={errorMessage}
        open={showErrorAlert}
        displayFunction={setShowErrorAlert}
      />
      <CardHeader className="h-[10%]">
        <CardTitle>Chat {chat.title} </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[85%]">
        <ScrollArea className="flex-grow border rounded p-2 mb-2 overflow-y-auto">
          {chat.messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 p-2 rounded ${message.type === 'bot' ? 'bg-amber-200 text-stone-900' : 'bg-stone-900 text-gray-100'
                }`}
            >
              <Markdown>{message.text}</Markdown>
            </div>
          ))}
        </ScrollArea>
        {image && (
          <div className="flex items-center gap-2 mt-2">
            <div className="border p-2 rounded flex items-center">
              <img
                src={URL.createObjectURL(image)}
                alt="Attached preview"
                className="w-16 h-16 object-cover rounded"
              />
              <Button variant="ghost" onClick={() => setImage(null)}>
                Remove
              </Button>
            </div>
          </div>
        )}
        <Progress value={progress} className={isLoading ? '' : 'hidden'} />
        <div className=" flex flex-col sm:flex-row">
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-stone-200"
          />
          <div className='flex flex-col m-2 gap-2 '>
            <div className='flex flex-row gap-3 '>
              <Button onClick={handleSubmit} className="flex items-center gap-1 grow">
                <Send size={16} /> Send
              </Button>

              <Button
                className="flex items-center gap-1"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <ImageIcon size={16} /> Upload File
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files?.[0] || null);
                }}
                style={{ display: 'none' }}
              />
            </div>
            <Button onClick={handleDownloadPDF} className=''>Download Content</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
