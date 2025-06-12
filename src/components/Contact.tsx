import React, { useState, FormEvent, ChangeEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const validateForm = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field being edited
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_ACCESS_KEY, 
          ...formData
        })
      });

    

      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full py-12 bg-gray-50  rounded-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block rounded-lg bg-blue-600 text-white px-4 py-2 mb-4 text-sm font-medium">
            Contact
          </div>
          <h2 className="text-3xl dark:text-black font-bold tracking-tight sm:text-4xl mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-8 md:text-lg">
            Have a question or want to collaborate? Fill out the form below, and I&apos;ll get back to you soon!
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-left text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} 
                  px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500 text-left">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} 
                  px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500 text-left">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-left text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className={`mt-1 w-full rounded-md border ${errors.message ? 'border-red-500' : 'border-gray-300'} 
                  px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Your message"
              />
              {errors.message && <p className="mt-1 text-sm text-red-500 text-left">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-md bg-blue-600 text-white py-3 px-4 font-medium 
                hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitStatus && (
              <p className={`mt-4 text-sm ${submitStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {submitStatus}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}