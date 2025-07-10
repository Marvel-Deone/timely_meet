import { features } from '@/lib/consts/data';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const Features = () => {
    return (
        <div className="mb-24">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">Key Features</h2>
            <div className="w-full flex flex-col md:flex-row gap-4">{features.map((feature, i: number) => {
                const Icon = feature.icon;
                return (
                    <Card key={i} className="md:basis-1/2 lg:basis-1/3 text-center">
                        <CardHeader>
                            <Icon className="w-12 h-12 text-blue mb-4 mx-auto text-blue-600" />
                            <CardTitle className="text-blue-600">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-gray-600">{feature.description}</p>
                        </CardContent>
                    </Card>
                )
            })}
            </div>
        </div>
    )
}

export default Features;
