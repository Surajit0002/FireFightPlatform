import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Smartphone, 
  Mail, 
  Monitor, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Globe,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityLog {
  id: number;
  action: string;
  details: any;
  ipAddress: string;
  success: boolean;
  riskScore: number;
  createdAt: string;
}

interface UserSession {
  id: string;
  deviceInfo: any;
  ipAddress: string;
  isActive: boolean;
  lastAccessedAt: string;
  createdAt: string;
}

export default function SecurityDashboard() {
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch user security info
  const { data: user } = useQuery({
    queryKey: ['/api', 'auth', 'user'],
  });

  // Fetch security logs
  const { data: securityLogs = [] } = useQuery({
    queryKey: ['/api', 'auth', 'security-logs'],
  });

  // Fetch active sessions
  const { data: sessions = [] } = useQuery({
    queryKey: ['/api', 'auth', 'sessions'],
  });

  // Fetch risk assessment
  const { data: riskAssessment } = useQuery({
    queryKey: ['/api', 'auth', 'risk-assessment'],
  });

  // Mutations
  const enable2FAMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/2fa/enable');
      return await response.json();
    },
    onSuccess: (data) => {
      setQrCodeVisible(true);
      toast({
        title: '2FA Enabled',
        description: 'Scan the QR code with your authenticator app.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api', 'auth', 'user'] });
    },
  });

  const disable2FAMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/2fa/disable');
    },
    onSuccess: () => {
      toast({
        title: '2FA Disabled',
        description: 'Two-factor authentication has been disabled.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api', 'auth', 'user'] });
    },
  });

  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      await apiRequest('DELETE', `/api/auth/sessions/${sessionId}`);
    },
    onSuccess: () => {
      toast({
        title: 'Session Revoked',
        description: 'The session has been successfully revoked.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api', 'auth', 'sessions'] });
    },
  });

  const revokeAllSessionsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', '/api/auth/sessions');
    },
    onSuccess: () => {
      toast({
        title: 'Sessions Revoked',
        description: 'All other sessions have been revoked.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api', 'auth', 'sessions'] });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/verify/email');
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Verification Email Sent',
        description: 'Check your email for the verification link.',
      });
    },
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/verify/phone');
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Verification SMS Sent',
        description: 'Check your phone for the verification code.',
      });
    },
  });

  const getRiskLevel = (score: number) => {
    if (score < 25) return { level: 'Low', color: 'bg-green-500', icon: CheckCircle };
    if (score < 50) return { level: 'Medium', color: 'bg-yellow-500', icon: AlertTriangle };
    if (score < 75) return { level: 'High', color: 'bg-orange-500', icon: AlertTriangle };
    return { level: 'Critical', color: 'bg-red-500', icon: XCircle };
  };

  const risk = riskAssessment ? getRiskLevel(riskAssessment.riskScore) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">Manage your account security and privacy settings</p>
        </div>
        {risk && (
          <Alert className={`w-64 ${risk.level === 'Low' ? 'border-green-500' : 'border-yellow-500'}`}>
            <risk.icon className="h-4 w-4" />
            <AlertDescription>
              Risk Level: <Badge variant={risk.level === 'Low' ? 'default' : 'destructive'}>{risk.level}</Badge>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Status</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {user?.security?.emailVerified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {user?.security?.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                {!user?.security?.emailVerified && (
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={() => verifyEmailMutation.mutate()}
                    loading={verifyEmailMutation.isPending}
                  >
                    Verify Email
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Phone Status</CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {user?.security?.phoneVerified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {user?.security?.phoneVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                {!user?.security?.phoneVerified && (
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={() => verifyPhoneMutation.mutate()}
                    loading={verifyPhoneMutation.isPending}
                  >
                    Verify Phone
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">2FA Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {user?.security?.twoFactorEnabled ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {user?.security?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sessions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Including current session
                </p>
              </CardContent>
            </Card>
          </div>

          {riskAssessment && (
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Current security risk level for your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Score</span>
                    <span className="text-sm font-medium">{riskAssessment.riskScore}/100</span>
                  </div>
                  <Progress value={riskAssessment.riskScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {risk?.level} risk level based on recent activity and login patterns
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Active Sessions</h3>
            <Button 
              variant="outline" 
              onClick={() => revokeAllSessionsMutation.mutate()}
              loading={revokeAllSessionsMutation.isPending}
            >
              Revoke All Other Sessions
            </Button>
          </div>
          
          <div className="space-y-4">
            {sessions.map((session: UserSession) => (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4" />
                        <span className="font-medium">
                          {session.deviceInfo?.userAgent || 'Unknown Device'}
                        </span>
                        <Badge variant="outline">Current</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>{session.ipAddress}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Last active: {new Date(session.lastAccessedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => revokeSessionMutation.mutate(session.id)}
                      loading={revokeSessionMutation.isPending}
                    >
                      Revoke
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <h3 className="text-lg font-medium">Recent Security Activity</h3>
          
          <div className="space-y-2">
            {securityLogs.map((log: SecurityLog) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {log.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium capitalize">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                        <Badge variant={log.success ? 'default' : 'destructive'}>
                          {log.success ? 'Success' : 'Failed'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{log.ipAddress}</span>
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                        <span>Risk: {log.riskScore}/100</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Secure your account with an authenticator app
                  </p>
                </div>
                <Switch 
                  checked={user?.security?.twoFactorEnabled}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      enable2FAMutation.mutate();
                    } else {
                      disable2FAMutation.mutate();
                    }
                  }}
                />
              </div>
              
              {qrCodeVisible && enable2FAMutation.data && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    QR Code: {enable2FAMutation.data.qrCodeUrl}
                    <br />
                    Secret: {enable2FAMutation.data.secret}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}