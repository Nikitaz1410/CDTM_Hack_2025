// src/components/ui/ServerStatusIndicator.jsx
import React, { useState, useEffect } from 'react';
import { Circle, CheckCircle, AlertCircle } from 'lucide-react';
import healthDataService from '../../services/healthDataService';

const ServerStatusIndicator = ({ expanded = false, position = 'header' }) => {
    const [isServerConnected, setIsServerConnected] = useState(true);
    const [lastCheck, setLastCheck] = useState(new Date());

    useEffect(() => {
        // Check server status periodically
        const checkConnection = async () => {
            const status = await healthDataService.checkServerConnection();
            setIsServerConnected(status);
            setLastCheck(new Date());
        };

        checkConnection();
        const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);

    if (position === 'header') {
        // Compact version for header
        return (
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Circle
                        size={10}
                        className={`${isServerConnected ? 'text-green-500 fill-green-500' : 'text-red-500 fill-red-500'}`}
                    />
                    {isServerConnected && (
                        <div className="absolute inset-0">
                            <Circle
                                size={10}
                                className="text-green-500 fill-green-500 animate-ping opacity-75"
                            />
                        </div>
                    )}
                </div>
                <span className={`text-sm font-medium ${isServerConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isServerConnected ? 'Server verbunden' : 'Server offline'}
        </span>
            </div>
        );
    }

    // Expanded version for page content
    return (
        <div className={`${
            isServerConnected
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
        } border rounded-lg p-3 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
                {isServerConnected ? (
                    <CheckCircle size={20} className="text-green-600" />
                ) : (
                    <AlertCircle size={20} className="text-red-600" />
                )}
                <div>
                    <div className="font-medium">
                        {isServerConnected ? 'Server verbunden' : 'Server offline'}
                    </div>
                    <div className="text-sm opacity-75">
                        {isServerConnected
                            ? 'Alle Daten werden vom Server geladen'
                            : 'Beispieldaten werden verwendet'}
                    </div>
                </div>
            </div>
            <div className="text-xs text-right opacity-75">
                <div>Zuletzt geprüft:</div>
                <div>{lastCheck.toLocaleTimeString('de-DE')}</div>
            </div>
        </div>
    );
};

export default ServerStatusIndicator;