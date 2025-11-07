'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileText,
  Users,
  BarChart3,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  ChevronRight,
  Building,
  DollarSign,
  Clock,
  Smartphone,
  Github,
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Professional Invoices',
    description:
      'Create stunning, professional invoices with customizable templates and detailed itemization.',
  },
  {
    icon: Users,
    title: 'Client Management',
    description:
      'Keep track of all your clients with detailed profiles, contact information, and invoice history.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Monitor your business performance with comprehensive analytics and revenue insights.',
  },
  {
    icon: Building,
    title: 'Company Profiles',
    description:
      'Add your company details to appear on invoices with branding and contact information.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your business data is securely stored and protected with industry-standard security measures.',
  },
  {
    icon: Zap,
    title: 'PDF Generation',
    description:
      'Generate professional PDF invoices instantly with customizable layouts and branding.',
  },
];

const screenshots = [
  {
    title: 'Dashboard Overview',
    description: 'Get a complete view of your business metrics at a glance',
    image: '/screenshots/dashboard.png',
    alt: 'Invoify dashboard showing key metrics and recent invoices',
  },
  {
    title: 'Invoice Creation',
    description:
      'Create professional invoices with ease using our intuitive form',
    image: '/screenshots/create-invoice.png',
    alt: 'Invoice creation form with company and client selection',
  },
  {
    title: 'Client Management',
    description: 'Organize and manage all your client relationships',
    image: '/screenshots/clients.png',
    alt: 'Client management interface showing client list and details',
  },
  {
    title: 'Analytics & Reports',
    description: 'Track your business performance with detailed analytics',
    image: '/screenshots/analytics.png',
    alt: 'Analytics dashboard with charts and insights',
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-600"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-slate-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-3xl font-bold text-slate-900 tracking-tight"
              >
                Invoify
              </Link>
            </div>
            <div className="hidden lg:flex items-center space-x-10">
              <Link
                href="#features"
                className="text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/privacy"
                className="text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium relative group"
              >
                Privacy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/terms"
                className="text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium relative group"
              >
                Terms
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 backdrop-blur-sm"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Get Started
                </Button>
              </Link>
              <a href="https://github.com/iamajraj/invoify">
                <Github />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:32px_32px] opacity-30"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-slate-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-slate-100/80 backdrop-blur-sm text-slate-700 text-sm font-semibold mb-12 border border-slate-200/50 shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
              Modern invoicing for modern businesses
            </div>

            <h1 className="text-6xl sm:text-8xl font-bold text-slate-900 mb-10 tracking-tight leading-none">
              Professional
              <br />
              <span className="text-slate-600">Invoices Made</span>
              <br />
              <span className="relative">Simple</span>
            </h1>

            <p className="text-xl text-slate-600 mb-16 max-w-3xl mx-auto leading-relaxed">
              Create stunning professional invoices, manage clients
              effortlessly, and track your business performance with the most
              intuitive invoicing platform designed for modern businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="cursor-pointer text-xl px-12 py-6 bg-slate-900 hover:bg-slate-800 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  Start Free Trial
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="cursor-pointer text-xl px-12 py-6 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl mx-auto">
              <div className="flex items-center justify-center p-4 bg-slate-50/50 rounded-2xl backdrop-blur-sm border border-slate-200/50">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                <span className="text-slate-700 font-medium">
                  No credit card required
                </span>
              </div>
              <div className="flex items-center justify-center p-4 bg-slate-50/50 rounded-2xl backdrop-blur-sm border border-slate-200/50">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                <span className="text-slate-700 font-medium">
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-40 bg-slate-50 relative overflow-hidden"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-slate-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-300 rounded-full blur-3xl opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">
              Everything you need to manage invoices
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Powerful features designed to streamline your invoicing process
              and grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-slate-200/50 to-slate-300/50 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-slate-200/50">
                  <CardContent className="p-10">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-slate-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-15"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">
              See Invoify in action
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Explore our intuitive interface designed for modern businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {screenshots.map((screenshot, index) => (
              <div key={index} className="group">
                <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white backdrop-blur-sm border border-slate-200/30">
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <img
                      src={screenshot.image}
                      alt={screenshot.alt}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    {/* Subtle overlay for better text readability */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        <p className="text-slate-800 font-semibold text-sm">
                          Interactive Preview
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-10">
                    <h3 className="text-3xl font-bold text-slate-900 mb-6">
                      {screenshot.title}
                    </h3>
                    <p className="text-slate-600 text-xl leading-relaxed">
                      {screenshot.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 bg-slate-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-700 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-slate-600 rounded-full blur-3xl opacity-15"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-6 py-3 rounded-full bg-slate-800/50 backdrop-blur-sm text-slate-300 text-sm font-medium border border-slate-700/50">
              ✨ Join the revolution
            </span>
          </div>

          <h2 className="text-5xl sm:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
            Ready to transform
            <br />
            <span className="text-slate-300">your invoicing?</span>
          </h2>

          <p className="text-2xl text-slate-300 mb-16 max-w-3xl mx-auto leading-relaxed">
            Start creating professional invoices today. No setup fees, no hidden
            costs, just pure productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="cursor-pointer bg-white text-slate-900 hover:bg-slate-100 text-2xl px-16 py-8 font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 rounded-2xl"
              >
                Start Your Free Trial
                <ArrowRight className="ml-4 h-8 w-8" />
              </Button>
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Free</div>
              <div className="text-slate-400">No credit card required</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Cancel</div>
              <div className="text-slate-400">Anytime, no penalties</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link
                href="/"
                className="text-3xl font-bold text-white mb-6 block tracking-tight"
              >
                Invoify
              </Link>
              <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
                The modern invoicing platform that helps businesses create
                professional invoices, manage clients, and track performance
                with unparalleled ease.
              </p>
              <div className="flex space-x-4">
                {/* Social links placeholders */}
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-slate-400 text-sm">T</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-slate-400 text-sm">L</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-slate-400 text-sm">G</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#features"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signin"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">
                &copy; 2025 Invoify. All rights reserved. | <a href="https://www.hexraj.com">Muhamamd Raj</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
