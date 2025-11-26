import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Search, Award } from 'lucide-react';
import { api } from '@/lib/api';

interface Certificate {
  id: string;
  examName: string;
  studentName: string;
  score: number;
  grade: string;
  issuedDate: string;
  qrCode: string;
  verifyToken: string;
  verifyUrl: string;
  pdfUrl?: string;
  downloadCount: number;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyToken, setVerifyToken] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const response = await api.get('/grading/certificates');
      setCertificates(response.data);
    } catch (error) {
      console.error('Failed to load certificates:', error);
      // Demo data
      setCertificates([
        {
          id: '1',
          examName: 'Mathematics Final Exam 2024',
          studentName: 'John Doe',
          score: 95,
          grade: 'A+',
          issuedDate: new Date().toISOString(),
          qrCode: 'QR-CODE-DATA',
          verifyToken: 'ABC123XYZ',
          verifyUrl: 'https://platform.zerquiz.com/verify/ABC123XYZ',
          pdfUrl: '/certificates/cert-1.pdf',
          downloadCount: 3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (certificateId: string) => {
    try {
      const response = await api.get(`/grading/certificates/${certificateId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download certificate:', error);
      alert('Failed to download certificate');
    }
  };

  const verifyCertificate = async () => {
    if (!verifyToken.trim()) return;

    try {
      const response = await api.get(`/grading/certificates/verify/${verifyToken}`);
      setVerifyResult(response.data);
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      setVerifyResult({ valid: false, error: 'Certificate not found' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Certificates</h1>
        <p className="text-muted-foreground">Manage and verify exam certificates</p>
      </div>

      {/* Certificate Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Verify Certificate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter certificate token (e.g., ABC123XYZ)"
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && verifyCertificate()}
            />
            <Button onClick={verifyCertificate}>
              <Search className="mr-2 h-4 w-4" />
              Verify
            </Button>
          </div>

          {verifyResult && (
            <div className={`p-4 rounded-lg ${verifyResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {verifyResult.valid ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Valid Certificate</span>
                  </div>
                  <div className="text-sm space-y-1 text-green-800">
                    <p><strong>Student:</strong> {verifyResult.studentName}</p>
                    <p><strong>Exam:</strong> {verifyResult.examName}</p>
                    <p><strong>Score:</strong> {verifyResult.score} ({verifyResult.grade})</p>
                    <p><strong>Issued:</strong> {new Date(verifyResult.issuedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-red-900">Invalid Certificate</span>
                  </div>
                  <p className="text-sm text-red-800 mt-1">{verifyResult.error}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificates List */}
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{cert.examName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Issued to {cert.studentName} on {new Date(cert.issuedDate).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default">Score: {cert.score}</Badge>
                      <Badge variant="secondary">Grade: {cert.grade}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Downloaded {cert.downloadCount} times
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(cert.verifyUrl, '_blank')}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="sm" onClick={() => downloadCertificate(cert.id)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

