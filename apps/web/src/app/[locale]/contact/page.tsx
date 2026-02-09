"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("sending");

    // Simulate form submission — replace with actual API endpoint
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormState("success");
    } catch {
      setFormState("error");
    }
  };

  return (
    <section className="py-12">
      <Container>
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <div className="max-w-2xl">
          {formState === "success" ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">{t("successMessage")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("nameLabel")}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("emailLabel")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("subjectLabel")}
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("messageLabel")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                />
              </div>

              {formState === "error" && (
                <p className="text-red-600 text-sm">{t("errorMessage")}</p>
              )}

              <button
                type="submit"
                disabled={formState === "sending"}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {formState === "sending" ? t("sending") : t("send")}
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
