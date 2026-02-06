'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ClaimBusinessLinkProps {
  listingId: string;
  listingName: string;
  listingType: 'solar-park' | 'sheep-farm';
}

export default function ClaimBusinessLink({ listingId, listingName, listingType }: ClaimBusinessLinkProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    relationship: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/claim-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          listingName,
          listingType,
          ...formData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', role: '', relationship: '', additionalInfo: '' });
        setTimeout(() => {
          setIsOpen(false);
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to submit claim. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
          title="Help us keep OMBAA accurate by verifying ownership."
        >
          Is this your business?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Claim This Listing</DialogTitle>
          <DialogDescription>
            Help us keep OMBAA accurate by verifying ownership.
          </DialogDescription>
        </DialogHeader>
        
        {submitStatus === 'success' ? (
          <div className="py-6 text-center">
            <p className="text-green-600 font-medium">Thank you for your submission.</p>
            <p className="text-gray-600 text-sm mt-2">We will review your claim and verify ownership.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Your Role</label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="representative">Authorized Representative</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Relationship to Business</label>
              <Input
                value={formData.relationship}
                onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                placeholder="e.g., Founder, Site Manager, Legal Rep..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Additional Information</label>
              <Textarea
                value={formData.additionalInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                placeholder="Any details that help us verify your ownership..."
                rows={3}
              />
            </div>

            {submitStatus === 'error' && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Claim'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
