import { Badge } from '../ui/badge';

const TheProblem = () => {
    return (
        <section className="py-20 lg:py-32 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
            {/* Background chaos elements */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-32 h-32 bg-red-200/30 rounded-lg rotate-12 blur-sm animate-float"></div>
                <div className="absolute top-32 right-20 w-24 h-24 bg-orange-200/30 rounded-lg -rotate-6 blur-sm animate-float delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-yellow-200/30 rounded-lg rotate-45 blur-sm animate-float delay-2000"></div>
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="text-center space-y-6 mb-20">
                    <Badge variant="secondary" className="bg-red-100 text-red-700 px-4 py-2">
                        🔥 The Problem
                    </Badge>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                        From scheduling
                        <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"> chaos</span>
                        <br />
                        to seamless
                        <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                            {" "}
                            harmony
                        </span>
                    </h2>
                </div>

                {/* Before/After Comparison */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* BEFORE - Chaos Side */}
                    <div className="space-y-8">
                        <div className="text-center lg:text-left">
                            <Badge variant="destructive" className="mb-4">
                                😵 Before TimelyMeet
                            </Badge>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">The Scheduling Nightmare</h3>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: "📧",
                                    title: "Email Tennis",
                                    description: "Endless back-and-forth emails trying to find a time that works",
                                    chaos: true,
                                },
                                {
                                    icon: "📅",
                                    title: "Double Bookings",
                                    description: "Accidentally scheduling two meetings at the same time",
                                    chaos: true,
                                },
                                {
                                    icon: "⏰",
                                    title: "Time Zone Confusion",
                                    description: "Missing meetings because of timezone mix-ups",
                                    chaos: true,
                                },
                                {
                                    icon: "🤯",
                                    title: "Calendar Chaos",
                                    description: "Juggling multiple calendars and losing track of availability",
                                    chaos: true,
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-start space-x-4 p-4 bg-white/60 rounded-xl border-l-4 border-red-400 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-x-2"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className="text-2xl animate-bounce" style={{ animationDelay: `${i * 200}ms` }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AFTER - Harmony Side */}
                    <div className="space-y-8">
                        <div className="text-center lg:text-left">
                            <Badge className="bg-green-100 text-green-700 mb-4">✨ After TimelyMeet</Badge>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Scheduling Bliss</h3>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: "🔗",
                                    title: "One-Click Booking",
                                    description: "Share your link and let others book instantly",
                                    solution: true,
                                },
                                {
                                    icon: "🛡️",
                                    title: "Smart Conflict Prevention",
                                    description: "Automatic availability sync prevents double bookings",
                                    solution: true,
                                },
                                {
                                    icon: "🌍",
                                    title: "Timezone Intelligence",
                                    description: "Automatic timezone detection and conversion",
                                    solution: true,
                                },
                                {
                                    icon: "🎯",
                                    title: "Unified Calendar",
                                    description: "All your meetings in one organized, beautiful interface",
                                    solution: true,
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border-l-4 border-green-400 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-x-2"
                                    style={{ animationDelay: `${i * 100 + 400}ms` }}
                                >
                                    <div className="text-2xl animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Transformation Arrow */}
                {/* <div className="flex justify-center my-16">
            <div className="bg-gradient-to-r from-red-500 via-orange-500 to-green-500 p-4 rounded-full shadow-xl animate-pulse hover:scale-110 transition-transform duration-300">
              <ArrowRight className="h-8 w-8 text-white" />
            </div>
          </div> */}

                {/* Stats Section */}
                {/* <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">The TimelyMeet Difference</h3>
              <p className="text-xl text-gray-600">Real results from real users</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "95%", label: "Less email back-and-forth", icon: "📧" },
                { number: "20hrs", label: "Saved per month", icon: "⏰" },
                { number: "0", label: "Double bookings", icon: "🛡️" },
                { number: "10x", label: "Faster scheduling", icon: "⚡" },
              ].map((stat, i) => (
                <div key={i} className="text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl mb-2 animate-bounce" style={{ animationDelay: `${i * 200}ms` }}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div> */}
            </div>
        </section>
    )
}

export default TheProblem;
