import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, BarChart } from 'lucide-react';
import Link from 'next/link';

export default function Home(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="absolute inset-0" />
        <div className="relative z-10">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            CREATE AI-POWERED FORMS <br /> IN SECONDS
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-foreground">
            Conversly lets you instantly generate beautiful, smart forms, surveys, and quizzes with
            the power of AI. Just describe what you need—Conversly does the rest.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="button-hover" asChild>
              <Link href="/create">
                Create New Form
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="button-hover" asChild>
              <Link href="/examples">See Examples</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Conversly?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="card-hover p-6">
              <Sparkles className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">AI-Powered Creation</h3>
              <p className="text-foreground">
                Describe your form needs and let Conversly generate a complete, professional form
                for you—instantly.
              </p>
            </div>
            <div className="card-hover p-6">
              <Zap className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Dynamic & Adaptive</h3>
              <p className="text-foreground">
                Build intelligent forms that adapt to user responses and generate relevant follow-up
                questions.
              </p>
            </div>
            <div className="card-hover p-6">
              <BarChart className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Instant Analytics</h3>
              <p className="text-foreground">
                Get real-time insights and visualizations from your form responses, right out of the
                box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Build Smarter Forms?</h2>
          <p className="mb-8 text-foreground">
            Join thousands of creators using Conversly to make better forms, surveys, and
            quizzes—faster than ever.
          </p>
          <Button size="lg" className="button-hover" asChild>
            <Link href="/create">
              Start Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
