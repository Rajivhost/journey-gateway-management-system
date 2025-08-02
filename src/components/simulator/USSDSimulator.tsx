import React, { useState, useEffect } from 'react';
import { Phone, Power, Volume2, Wifi, Battery, Signal } from 'lucide-react';

interface SimulatorStep {
  id: string;
  type: 'menu' | 'input' | 'display' | 'end';
  text: string;
  options?: Array<{
    key: string;
    text: string;
    next: string;
  }>;
  next?: string;
  validation?: 'phone' | 'number' | 'text';
}

interface SimulatorSession {
  sessionId: string;
  currentStepId: string;
  history: Array<{
    stepId: string;
    userInput?: string;
    timestamp: Date;
  }>;
  variables: Record<string, string>;
}

const mockJourneySteps: Record<string, SimulatorStep> = {
  welcome: {
    id: 'welcome',
    type: 'menu',
    text: 'Welcome to Mobile Money\n1. Send Money\n2. Check Balance\n3. Buy Airtime\n4. Pay Bills\n0. Exit',
    options: [
      { key: '1', text: 'Send Money', next: 'send_money' },
      { key: '2', text: 'Check Balance', next: 'check_balance' },
      { key: '3', text: 'Buy Airtime', next: 'buy_airtime' },
      { key: '4', text: 'Pay Bills', next: 'pay_bills' },
      { key: '0', text: 'Exit', next: 'exit' }
    ]
  },
  send_money: {
    id: 'send_money',
    type: 'input',
    text: 'Enter recipient phone number:',
    next: 'amount_input',
    validation: 'phone'
  },
  amount_input: {
    id: 'amount_input',
    type: 'input',
    text: 'Enter amount to send:',
    next: 'confirm_transfer',
    validation: 'number'
  },
  confirm_transfer: {
    id: 'confirm_transfer',
    type: 'menu',
    text: 'Confirm transfer of {{amount}} XAF to {{recipient}}?\n1. Confirm\n2. Cancel',
    options: [
      { key: '1', text: 'Confirm', next: 'transfer_success' },
      { key: '2', text: 'Cancel', next: 'welcome' }
    ]
  },
  transfer_success: {
    id: 'transfer_success',
    type: 'display',
    text: 'Transfer successful!\nTransaction ID: TXN{{random}}\nNew balance: 45,000 XAF\n\nThank you for using Mobile Money.',
    next: 'end'
  },
  check_balance: {
    id: 'check_balance',
    type: 'display',
    text: 'Your current balance is:\n50,000 XAF\n\nThank you for using Mobile Money.',
    next: 'end'
  },
  buy_airtime: {
    id: 'buy_airtime',
    type: 'input',
    text: 'Enter amount for airtime:',
    next: 'airtime_success',
    validation: 'number'
  },
  airtime_success: {
    id: 'airtime_success',
    type: 'display',
    text: 'Airtime purchase successful!\n{{amount}} XAF airtime added to your account.\n\nThank you for using Mobile Money.',
    next: 'end'
  },
  pay_bills: {
    id: 'pay_bills',
    type: 'menu',
    text: 'Select bill type:\n1. Electricity\n2. Water\n3. Internet\n0. Back',
    options: [
      { key: '1', text: 'Electricity', next: 'bill_amount' },
      { key: '2', text: 'Water', next: 'bill_amount' },
      { key: '3', text: 'Internet', next: 'bill_amount' },
      { key: '0', text: 'Back', next: 'welcome' }
    ]
  },
  bill_amount: {
    id: 'bill_amount',
    type: 'input',
    text: 'Enter bill amount:',
    next: 'bill_success',
    validation: 'number'
  },
  bill_success: {
    id: 'bill_success',
    type: 'display',
    text: 'Bill payment successful!\nAmount: {{amount}} XAF\nReference: REF{{random}}\n\nThank you for using Mobile Money.',
    next: 'end'
  },
  exit: {
    id: 'exit',
    type: 'end',
    text: 'Thank you for using Mobile Money.\nHave a great day!'
  },
  end: {
    id: 'end',
    type: 'end',
    text: 'Session ended.'
  }
};

export const USSDSimulator: React.FC = () => {
  const [isOn, setIsOn] = useState(true);
  const [currentInput, setCurrentInput] = useState('');
  const [session, setSession] = useState<SimulatorSession | null>(null);
  const [displayText, setDisplayText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeypad, setShowKeypad] = useState(true);

  const keypadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  const keypadLetters = [
    ['', 'ABC', 'DEF'],
    ['GHI', 'JKL', 'MNO'],
    ['PQRS', 'TUV', 'WXYZ'],
    ['', '', '']
  ];

  const generateRandomId = () => Math.random().toString(36).substr(2, 6).toUpperCase();

  const replaceVariables = (text: string, variables: Record<string, string>) => {
    let result = text;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    result = result.replace(/{{random}}/g, generateRandomId());
    return result;
  };

  const startUSSDSession = (code: string) => {
    if (!code.startsWith('*') || !code.endsWith('#')) {
      setDisplayText('Invalid USSD code format. Please use *code# format.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const newSession: SimulatorSession = {
        sessionId: generateRandomId(),
        currentStepId: 'welcome',
        history: [],
        variables: {}
      };
      
      setSession(newSession);
      const step = mockJourneySteps['welcome'];
      setDisplayText(step.text);
      setCurrentInput('');
      setIsLoading(false);
    }, 1500);
  };

  const processUserInput = (input: string) => {
    if (!session) return;

    setIsLoading(true);

    setTimeout(() => {
      const currentStep = mockJourneySteps[session.currentStepId];
      let nextStepId = '';
      const newVariables = { ...session.variables };

      if (currentStep.type === 'menu') {
        const option = currentStep.options?.find(opt => opt.key === input);
        if (option) {
          nextStepId = option.next;
        } else {
          setDisplayText('Invalid option. Please try again.\n\n' + currentStep.text);
          setIsLoading(false);
          return;
        }
      } else if (currentStep.type === 'input') {
        // Validate input based on type
        if (currentStep.validation === 'phone' && !/^\+?[0-9]{9,15}$/.test(input)) {
          setDisplayText('Invalid phone number format. Please try again.\n\nEnter recipient phone number:');
          setIsLoading(false);
          return;
        } else if (currentStep.validation === 'number' && !/^\d+$/.test(input)) {
          setDisplayText('Invalid number format. Please try again.\n\n' + currentStep.text);
          setIsLoading(false);
          return;
        }

        // Store the input as a variable
        if (session.currentStepId === 'send_money') {
          newVariables.recipient = input;
        } else if (session.currentStepId === 'amount_input' || session.currentStepId === 'buy_airtime' || session.currentStepId === 'bill_amount') {
          newVariables.amount = input;
        }

        nextStepId = currentStep.next || 'end';
      }

      if (nextStepId === 'end' || !mockJourneySteps[nextStepId]) {
        setSession(null);
        setDisplayText('Session ended. Dial a USSD code to start a new session.');
        setCurrentInput('');
        setIsLoading(false);
        return;
      }

      const nextStep = mockJourneySteps[nextStepId];
      const processedText = replaceVariables(nextStep.text, newVariables);

      const updatedSession: SimulatorSession = {
        ...session,
        currentStepId: nextStepId,
        variables: newVariables,
        history: [
          ...session.history,
          {
            stepId: session.currentStepId,
            userInput: input,
            timestamp: new Date()
          }
        ]
      };

      setSession(updatedSession);
      setDisplayText(processedText);
      setCurrentInput('');
      setIsLoading(false);

      if (nextStep.type === 'display') {
        // Auto-advance after displaying information
        setTimeout(() => {
          if (nextStep.next) {
            const finalStep = mockJourneySteps[nextStep.next];
            if (finalStep) {
              setDisplayText(finalStep.text);
              if (finalStep.type === 'end') {
                setSession(null);
              }
            }
          }
        }, 3000);
      }
    }, 800);
  };

  const handleKeyPress = (key: string) => {
    if (!isOn) return;

    if (key === 'call') {
      if (currentInput && !session) {
        startUSSDSession(currentInput);
      } else if (session && currentInput) {
        processUserInput(currentInput);
      }
      return;
    }

    if (key === 'clear') {
      setCurrentInput('');
      return;
    }

    if (key === 'end') {
      setSession(null);
      setCurrentInput('');
      setDisplayText('');
      return;
    }

    setCurrentInput(prev => prev + key);
  };

  const togglePower = () => {
    setIsOn(!isOn);
    if (isOn) {
      setSession(null);
      setCurrentInput('');
      setDisplayText('');
    }
  };

  useEffect(() => {
    if (!isOn) {
      setDisplayText('');
    } else if (!session && !displayText) {
      setDisplayText('Welcome to USSDLink Simulator\n\nDial a USSD code (e.g., *123#) and press the green call button to start.');
    }
  }, [isOn, session, displayText]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
          <div className="w-full h-full bg-gray-900 rounded-[2.5rem] relative overflow-hidden">
            
            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 py-2 text-white text-xs">
              <div className="flex items-center space-x-1">
                <Signal className="w-3 h-3" />
                <span>Africas Talking</span>
              </div>
              <div className="flex items-center space-x-1">
                <Wifi className="w-3 h-3" />
                <Battery className="w-4 h-2 border border-white rounded-sm">
                  <div className="w-3/4 h-full bg-white rounded-sm"></div>
                </Battery>
              </div>
            </div>

            {/* Screen */}
            <div className="bg-green-50 mx-4 my-2 rounded-lg h-64 relative">
              {isOn ? (
                <div className="p-4 h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900 whitespace-pre-line font-mono leading-relaxed">
                        {displayText}
                      </div>
                    )}
                  </div>
                  
                  {/* Input Display */}
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="text-xs text-gray-600 mb-1">Input:</div>
                    <div className="bg-white border border-gray-300 rounded px-2 py-1 text-sm font-mono min-h-[24px]">
                      {currentInput}
                      <span className="animate-pulse">|</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-black rounded-lg">
                  <div className="text-gray-600 text-sm">Power Off</div>
                </div>
              )}
            </div>

            {/* Keypad */}
            {showKeypad && (
              <div className="px-4 py-2">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {keypadNumbers.map((row, rowIndex) => 
                    row.map((number, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleKeyPress(number)}
                        disabled={!isOn}
                        className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg h-12 flex flex-col items-center justify-center text-lg font-semibold transition-colors"
                      >
                        <span>{number}</span>
                        <span className="text-xs text-gray-400">
                          {keypadLetters[rowIndex][colIndex]}
                        </span>
                      </button>
                    ))
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleKeyPress('call')}
                    disabled={!isOn}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-800 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                    title="Call / Send"
                  >
                    <Phone className="w-5 h-5" />
                  </button>

                  <button
                    onClick={togglePower}
                    className="bg-gray-600 hover:bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                    title="Power"
                  >
                    <Power className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleKeyPress('end')}
                    disabled={!isOn}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-800 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                    title="End Call"
                  >
                    <Phone className="w-5 h-5 rotate-135" />
                  </button>
                </div>

                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => handleKeyPress('clear')}
                    disabled={!isOn}
                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white rounded-lg px-4 py-2 text-sm transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Home Button */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute -right-80 top-0 w-72 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">1</div>
              <div>
                <p className="font-medium text-gray-900">Dial USSD Code</p>
                <p>Enter a USSD code like *123# using the keypad</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">2</div>
              <div>
                <p className="font-medium text-gray-900">Press Call</p>
                <p>Press the green call button to initiate the session</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">3</div>
              <div>
                <p className="font-medium text-gray-900">Navigate</p>
                <p>Use the number keys to select menu options or enter data</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">4</div>
              <div>
                <p className="font-medium text-gray-900">End Session</p>
                <p>Press the red button to end the current session</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Sample USSD Codes</h4>
            <div className="space-y-1 text-sm text-yellow-700">
              <p><code className="bg-yellow-100 px-1 rounded">*123#</code> - Mobile Money</p>
              <p><code className="bg-yellow-100 px-1 rounded">*456#</code> - Balance Check</p>
              <p><code className="bg-yellow-100 px-1 rounded">*789#</code> - Airtime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};