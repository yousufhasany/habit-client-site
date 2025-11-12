export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-base-300 to-base-200 border-t border-base-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                H
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">HabitTracker</span>
            </div>
            <p className="text-base-content/70 mb-4 max-w-md">
              Transform your life one habit at a time. Join thousands of people building better routines and achieving their goals.
            </p>
            <div className="flex gap-3">
              <a href="#" className="btn btn-circle btn-sm bg-base-100 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white border-base-300 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
              </a>
              <a href="#" className="btn btn-circle btn-sm bg-base-100 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white border-base-300 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="btn btn-circle btn-sm bg-base-100 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white border-base-300 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="link link-hover text-base-content/70 hover:text-indigo-600">About Us</a></li>
              <li><a href="#" className="link link-hover text-base-content/70 hover:text-indigo-600">Careers</a></li>
              <li><a href="#" className="link link-hover text-base-content/70 hover:text-indigo-600">Blog</a></li>
              <li><a href="#" className="link link-hover text-base-content/70 hover:text-indigo-600">Press Kit</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="link link-hover text-base-content/70 hover:text-indigo-600">Help Center</a></li>
              <li><a href="#" className="link link-hover text-base-content/70 hover:text-indigo-600">Contact Us</a></li>
              <li><a href="#" className="link link-hover text-base-content/70 hover:text-indigo-600">Privacy Policy</a></li>
              <li><a href="#" className="link link-hover text-base-content/70 hover:text-indigo-600">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-base-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-base-content/60">
              © {new Date().getFullYear()} HabitTracker. All rights reserved. Built with for better habits Yousuf Hasan.
            </p>
            <div className="flex gap-6 text-sm text-base-content/60">
              <a href="#" className="hover:text-indigo-600">Privacy</a>
              <a href="#" className="hover:text-indigo-600">Terms</a>
              <a href="#" className="hover:text-indigo-600">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
