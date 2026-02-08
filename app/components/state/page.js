<div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />

            {/* Main Image Container */}
            <div className="relative">
              {/* Card Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-[#3a7cb3] rounded-2xl rotate-3 opacity-20" />
              
              {/* Image with border */}
              <div className="relative bg-white rounded-2xl p-2 shadow-2xl">
                <div className="relative h-96 rounded-xl overflow-hidden">
                  {/* Fallback Image or Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                  
                  {/* If you have an image */}
                  <img
                    src='/banner/banner1.png' // আপনার ইমেজ পাথ অনুযায়ী
                    alt="Logistics Network"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      // Show placeholder content
                      const placeholder = document.createElement('div');
                      placeholder.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-[#3a7cb3]/10';
                      placeholder.innerHTML = `
                        <div class="text-center p-8">
                          <div class="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                            <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          </div>
                          <h3 class="text-xl font-bold text-primary mb-2">SwiftLogix Logistics</h3>
                          <p class="text-gray-600">Global logistics solutions</p>
                        </div>
                      `;
                      e.target.parentNode.appendChild(placeholder);
                    }}
                  />
                  
                  {/* Floating Stats */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { number: '24/7', label: 'Support' },
                          { number: '99%', label: 'On Time' },
                          { number: '150+', label: 'Countries' },
                        ].map((stat, index) => (
                          <div key={index} className="text-center">
                            <div className="text-2xl font-bold text-primary">{stat.number}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>