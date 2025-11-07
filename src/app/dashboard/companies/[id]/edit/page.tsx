'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Save, Building } from 'lucide-react';
import { toast } from 'sonner';

interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditCompanyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    taxId: '',
    website: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (companyId && session) {
      fetchCompany();
    }
  }, [companyId, session]);

  const fetchCompany = async () => {
    try {
      const response = await fetch(`/api/companies/${companyId}`);
      if (response.ok) {
        const company: Company = await response.json();
        setFormData({
          name: company.name,
          email: company.email,
          phone: company.phone || '',
          address: company.address || '',
          city: company.city || '',
          state: company.state || '',
          zipCode: company.zipCode || '',
          country: company.country || '',
          taxId: company.taxId || '',
          website: company.website || '',
        });
      } else {
        toast.error('Failed to fetch company details');
        router.push('/dashboard/companies');
      }
    } catch (error) {
      toast.error('Something went wrong');
      router.push('/dashboard/companies');
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Company name and email are required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Company updated successfully');
        router.push('/dashboard/companies');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update company');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/companies">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Edit Company
              </h1>
              <p className="text-slate-600 mt-1">
                Update your company information
              </p>
            </div>
          </div>
          <Link href="/dashboard/companies">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>

        {/* Form */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Building className="mr-3 h-6 w-6 text-slate-600" />
              Company Information
            </CardTitle>
            <CardDescription>
              Update your company details. This information will appear as the
              sender on your invoices.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-slate-700 font-semibold"
                    >
                      Company Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      placeholder="Enter company name"
                      required
                      className="h-12 text-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 font-semibold"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      placeholder="company@example.com"
                      required
                      className="h-12 text-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-slate-700 font-semibold"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      placeholder="+1 (555) 123-4567"
                      className="h-12 text-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="website"
                      className="text-slate-700 font-semibold"
                    >
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        handleInputChange('website', e.target.value)
                      }
                      placeholder="https://www.company.com"
                      className="h-12 text-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Address Information
                </h3>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-slate-700 font-semibold"
                  >
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    placeholder="123 Business Street"
                    className="h-12 text-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="city"
                      className="text-slate-700 font-semibold"
                    >
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange('city', e.target.value)
                      }
                      placeholder="Business City"
                      className="h-12 text-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="state"
                      className="text-slate-700 font-semibold"
                    >
                      State/Province
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange('state', e.target.value)
                      }
                      placeholder="State or Province"
                      className="h-12 text-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="zipCode"
                      className="text-slate-700 font-semibold"
                    >
                      ZIP/Postal Code
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange('zipCode', e.target.value)
                      }
                      placeholder="12345"
                      className="h-12 text-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className="text-slate-700 font-semibold"
                  >
                    Country
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange('country', e.target.value)
                    }
                    placeholder="United States"
                    className="h-12 text-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                  />
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Business Information
                </h3>

                <div className="space-y-2">
                  <Label
                    htmlFor="taxId"
                    className="text-slate-700 font-semibold"
                  >
                    Tax ID / VAT Number
                  </Label>
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    placeholder="Enter tax ID or VAT number"
                    className="h-12 text-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-8 border-t border-slate-200">
                <Link href="/dashboard/companies">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    'Updating...'
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Company
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
