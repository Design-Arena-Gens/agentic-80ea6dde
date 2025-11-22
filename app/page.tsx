'use client';

import { useState, useRef, useEffect } from 'react';
import { Monitor, MessageSquare, Image, FileText, Send, Mic, Camera, Settings, Power } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: 'سلام! من دستیار هوشمند شما هستم. چطور می‌توانم کمکتان کنم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      setMediaStream(stream);
      setScreenSharing(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error('خطا در اشتراک‌گذاری صفحه:', err);
      alert('امکان دسترسی به صفحه نمایش وجود ندارد. لطفاً دسترسی‌های مرورگر را بررسی کنید.');
    }
  };

  const stopScreenShare = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setScreenSharing(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      let response = '';
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('سلام') || lowerInput.includes('hello')) {
        response = 'سلام! چه کاری می‌توانم برایتان انجام دهم؟';
      } else if (lowerInput.includes('صفحه') || lowerInput.includes('دسکتاپ') || lowerInput.includes('screen')) {
        response = 'برای مشاهده صفحه دسکتاپ شما، لطفاً روی دکمه "اشتراک‌گذاری صفحه" کلیک کنید. من می‌توانم صفحه شما را مشاهده و راهنمایی کنم.';
      } else if (lowerInput.includes('فایل') || lowerInput.includes('file')) {
        response = 'من می‌توانم به شما در مدیریت فایل‌ها کمک کنم. چه فایلی را جستجو می‌کنید؟';
      } else if (lowerInput.includes('برنامه') || lowerInput.includes('app')) {
        response = 'می‌توانم به شما در اجرا و مدیریت برنامه‌ها کمک کنم. چه برنامه‌ای نیاز دارید؟';
      } else if (lowerInput.includes('تنظیمات') || lowerInput.includes('settings')) {
        response = 'من می‌توانم شما را در تنظیمات سیستم راهنمایی کنم. به چه تنظیماتی نیاز دارید؟';
      } else {
        response = `درخواست شما را دریافت کردم: "${input}". من در حال حاضر به صورت نمایشی کار می‌کنم. برای دسترسی کامل به دسکتاپ، لطفاً صفحه خود را به اشتراک بگذارید.`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-lg">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">دستیار هوشمند دسکتاپ</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isConnected ? '🟢 متصل' : '🔴 غیرفعال'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsConnected(!isConnected)}
                className={`p-2 rounded-lg transition-colors ${
                  isConnected
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
                title={isConnected ? 'قطع اتصال' : 'اتصال'}
              >
                <Power className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="تنظیمات"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
          {/* Chat Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                گفتگو با دستیار
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSend}
                  className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop View Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5" />
                نمای دسکتاپ
              </h2>
            </div>

            <div className="flex-1 p-4 flex flex-col items-center justify-center">
              {screenSharing ? (
                <div className="w-full h-full flex flex-col">
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-full object-contain bg-black rounded-lg"
                  />
                  <button
                    onClick={stopScreenShare}
                    className="mt-2 w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    توقف اشتراک‌گذاری
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg mb-4">
                    <Monitor className="w-16 h-16 mx-auto text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    برای دسترسی دستیار به صفحه نمایش خود، روی دکمه زیر کلیک کنید
                  </p>
                  <button
                    onClick={startScreenShare}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors"
                  >
                    اشتراک‌گذاری صفحه
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 border-t dark:border-gray-700 space-y-2">
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Image className="w-4 h-4" />
                گرفتن اسکرین‌شات
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <FileText className="w-4 h-4" />
                مشاهده فایل‌ها
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
