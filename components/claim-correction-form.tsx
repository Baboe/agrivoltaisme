'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ClaimCorrectionFormProps {
  solarParkName: string;
  solarParkLocation: string;
  currentStatus: string;
}

export default function ClaimCorrectionForm({ solarParkName, solarParkLocation, currentStatus }: ClaimCorrectionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    relationship: '',
    correction: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/claim-correction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          solarParkName,
          solarParkLocation,
          currentStatus
        }),
      });

      if (response.ok) {
        setSubmitMessage('Thank you for your feedback. We will review this submission.');
        setFormData({ name: '', email: '', role: '', relationship: '', correction: '' });
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setSubmitMessage('Failed to submit. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-sm text-blue-600 hover:text-blue-800 underline mt-1">
          Claim or correct this grazing status
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Claim or Correct Grazing Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solar_operator">Solar operator</SelectItem>
                <SelectItem value="grazier">Grazier / shepherd</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Relationship to site</label>
            <Input
              value={formData.relationship}
              onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
              placeholder="e.g., Owner, Manager, Neighbor..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">What should be corrected or added?</label>
            <Textarea
              value={formData.correction}
              onChange={(e) => setFormData(prev => ({ ...prev, correction: e.target.value }))}
              placeholder="Please describe what is incorrect or missing about the grazing status..."
              rows={4}
            />
          </div>

          {submitMessage && (
            <div className={`text-sm ${submitMessage.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
              {submitMessage}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}