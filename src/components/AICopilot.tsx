import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Terminal,
  ShieldCheck,
  BookOpen,
  User,
  ArrowUpRight,
  Database,
  Cpu
} from 'lucide-react';
import { processCopilotQuery, CopilotResponse } from '../services/aiCopilotService';
import { Customer } from '../types';

interface AICopilotProps {
  onSelectCustomer: (customer: Customer) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  response?: CopilotResponse;
  timestamp: string;
}

export const AICopilot: React.FC<AICopilotProps> = ({ onSelectCustomer }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: `Hello! I am **BankGuard AI Analytics Copilot**.

I operate on the verified 10,000 customer records in \`European_Bank.csv\` using safe, guarded analytical tools. I never execute unvalidated SQL or hallucinate statistics.

You can ask me questions about churn rates, geographic disparities, TreeSHAP drivers, or request priority at-risk rosters.`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Which country has the highest churn rate?',
    'Show German high-risk accounts with balance over €100k',
    'Why do customers with 3+ products churn so frequently?',
    'What are the primary TreeSHAP churn drivers?',
    'Compare France and Germany retention metrics'
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await processCopilotQuery(textToSend);
      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: response.answer,
        response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: 'Apologies, an error occurred while executing the analytical query. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-indigo-400" />
              <span>MULTI-AGENT TOOL-DISPATCH ARCHITECTURE</span>
            </span>
            <span className="text-xs text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guarded Analytical Tools (No Raw SQL Injection)</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">BankGuard AI Analytics Copilot</h1>
          <p className="text-xs text-slate-400">
            Natural language portfolio query interface with verified database tool calls and transparent telemetry.
          </p>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition text-left"
          >
            "{p}"
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 min-h-[480px] max-h-[640px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-4 text-xs ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950/80 text-slate-200 border border-slate-800 space-y-3'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 border-b border-slate-800/60 pb-1">
                  <span className="font-semibold flex items-center space-x-1">
                    {m.sender === 'user' ? (
                      <span>You</span>
                    ) : (
                      <>
                        <Bot className="w-3 h-3 text-indigo-400" />
                        <span className="text-indigo-300">BankGuard AI Copilot</span>
                      </>
                    )}
                  </span>
                  <span>{m.timestamp}</span>
                </div>

                {/* Body Content */}
                <div className="leading-relaxed whitespace-pre-line font-sans text-[13px]">
                  {m.text}
                </div>

                {/* Tool Telemetry Box */}
                {m.response?.toolCalls && m.response.toolCalls.length > 0 && (
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center space-x-1 font-mono text-emerald-400">
                        <Terminal className="w-3 h-3" />
                        <span>Backend Tool Execution Telemetry</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Guarded Query
                      </span>
                    </div>

                    {m.response.toolCalls.map((tc, tidx) => (
                      <div key={tidx} className="bg-slate-950 p-2 rounded text-[11px] font-mono text-slate-300 border border-slate-800/60">
                        <div className="flex items-center justify-between text-indigo-300">
                          <code>{tc.toolName}</code>
                          <span className="text-slate-400">{tc.executionTimeMs}ms • {tc.recordsReturned} records</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">{tc.resultSummary}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Citations Box */}
                {m.response?.citedSources && m.response.citedSources.length > 0 && (
                  <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800 flex items-center space-x-2">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong>Literature Grounding:</strong> {m.response.citedSources.join(' • ')}</span>
                  </div>
                )}

                {/* Returned Interactive Customer Cards */}
                {m.response?.relevantCustomers && m.response.relevantCustomers.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-300">
                      Matching Customer Profiles ({m.response.relevantCustomers.length} returned):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.response.relevantCustomers.map((cust) => (
                        <div
                          key={cust.customerId}
                          onClick={() => onSelectCustomer(cust)}
                          className="bg-slate-900 hover:bg-slate-800/80 p-2.5 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold text-slate-200 text-xs">
                              {cust.surname} <span className="font-mono text-slate-400 text-[10px]">({cust.customerId})</span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {cust.geography} • €{cust.balance.toLocaleString()} • {cust.numOfProducts} prod
                            </div>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-950 text-rose-300 border border-rose-800">
                            {cust.riskScore}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>Executing guarded tool call and compiling verified statistics...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask BankGuard AI anything about churn, Germany vs France, products, or high-risk accounts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-400 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm shadow-indigo-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
