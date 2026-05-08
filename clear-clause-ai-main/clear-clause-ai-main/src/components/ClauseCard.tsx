import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Shield, FileText } from 'lucide-react';

type RiskLevel = 'safe' | 'moderate' | 'high' | string;

interface Clause {
  id?: string | number;
  text: string;
  type?: string;
  risk?: RiskLevel;
  implications?: string | null;
}

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'safe':
      return 'bg-success text-success-foreground';
    case 'moderate':
      return 'bg-warning text-warning-foreground';
    case 'high':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getRiskIcon = (risk: RiskLevel) => {
  switch (risk) {
    case 'safe':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'moderate':
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case 'high':
      return <Shield className="w-5 h-5 text-red-600" />;
    default:
      return <FileText className="w-5 h-5 text-muted-foreground" />;
  }
};

export default function ClauseCard({ clause }: { clause: Clause }) {
  return (
    <Card className="shadow-sm rounded-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">{getRiskIcon(clause.risk ?? 'moderate')}</div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-semibold">{clause.type ?? 'Unspecified'}</h4>
                <Badge className={getRiskColor(clause.risk ?? 'moderate')}>{(clause.risk ?? 'moderate').toString().toUpperCase()}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm leading-relaxed text-foreground">{clause.text}</p>
        </div>

        {clause.implications && (
          <div className="mt-3 text-sm italic text-muted-foreground">{clause.implications}</div>
        )}
      </CardContent>
    </Card>
  );
}
