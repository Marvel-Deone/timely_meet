import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { features } from '@/lib/const/data';

const Features = () => {
    return (
        <section id="features" className="py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-6 mb-16">
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 px-4 py-2">
                        Features
                    </Badge>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                        Everything you need to
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {" "}
                            schedule smarter
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Powerful features designed to make scheduling effortless and professional.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => {
                        const Icon = feature.icon
                        return (
                            <Card
                                key={i}
                                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm hover:scale-105 hover:-translate-y-2"
                                style={{ animationDelay: `${i * 200}ms` }}
                            >
                                <CardHeader className="text-center pb-4">
                                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Features;
