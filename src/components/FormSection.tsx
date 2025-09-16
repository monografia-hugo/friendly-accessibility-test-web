// Form with multiple accessibility violations
import React from 'react';

const FormSection = () => {
  return (
    <section className="stat-card p-6 rounded-lg mb-6">
      {/* Wrong heading hierarchy - h6 after h1 */}
      <h6 className="text-base font-bold stat-title mb-4">Contact Form</h6>
      
      <form className="space-y-4">
        {/* Input without label - accessibility violation */}
        <input 
          type="text"
          placeholder="Name"
          className="w-full p-3 border rounded"
          required
          // No associated label
        />

        {/* Email field with placeholder as label - accessibility violation */}
        <input 
          type="email"
          placeholder="Email Address"
          className="w-full p-3 border rounded"
          required
          // Placeholder disappears when typing
        />

        {/* Select without label */}
        <select className="w-full p-3 border rounded">
          <option value="">Choose Department</option>
          <option value="sales">Sales</option>
          <option value="support">Support</option>
          <option value="billing">Billing</option>
        </select>

        {/* Radio buttons without fieldset/legend */}
        <div>
          <div className="text-sm font-medium mb-2">Priority Level</div>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input type="radio" name="priority" value="low" id="low" />
              <div className="ml-2 text-sm">Low</div>
            </div>
            <div className="flex items-center">
              <input type="radio" name="priority" value="medium" id="medium" />
              <div className="ml-2 text-sm">Medium</div>
            </div>
            <div className="flex items-center">
              <input type="radio" name="priority" value="high" id="high" />
              <div className="ml-2 text-sm">High</div>
            </div>
          </div>
        </div>

        {/* Textarea without label */}
        <textarea 
          placeholder="Your message..."
          rows={4}
          className="w-full p-3 border rounded resize-none"
          required
          // No label association
        />

        {/* Checkbox without proper label */}
        <div className="flex items-center">
          <input type="checkbox" id="newsletter" />
          <div className="ml-2 text-sm">
            Subscribe to newsletter
          </div>
        </div>

        {/* File upload without instructions */}
        <input 
          type="file"
          className="w-full p-3 border rounded"
          accept=".pdf,.doc,.docx"
          // No label or instructions about file types
        />

        {/* Submit button with poor contrast */}
        <button 
          type="submit"
          className="w-full py-3 bg-gray-400 text-gray-100 rounded hover:bg-gray-500"
          // Low contrast - accessibility violation
        >
          Submit Request
        </button>

        {/* Error messages without proper association */}
        <div className="text-red-500 text-sm">
          Please fill in all required fields
          {/* Generic error without field association */}
        </div>
      </form>

      {/* CAPTCHA without alternative */}
      <div className="mt-4 p-4 border rounded">
        <div className="text-sm font-medium mb-2">Security Check</div>
        <img 
          src="/placeholder.svg"
          className="h-12 mb-2"
          // CAPTCHA image without alt text or audio alternative
        />
        <input 
          type="text"
          placeholder="Enter the text above"
          className="w-full p-2 border rounded"
          // No label
        />
      </div>
    </section>
  );
};

export default FormSection;