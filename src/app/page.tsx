import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {/* Герой секция */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <Badge
                                        variant="secondary"
                                        className="w-fit"
                                    >
                                        За танцови професионалисти
                                    </Badge>
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Оптимизирайте управлението на танцовото
                                        си студио
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Цялостна платформа за хореографи за
                                        проследяване на репетиции, управление на
                                        плащания и организиране на танцови
                                        групи. Създадена от танцьори, за
                                        танцьори.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                    >
                                        <Link href="/auth">
                                            Започнете своето пътешествие
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg">
                                        Научете повече
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <Image
                                    alt="Табло за управление на танцово студио"
                                    className="aspect-video overflow-hidden rounded-xl object-cover shadow-2xl"
                                    height="400"
                                    src="/dancers.jpg"
                                    width="600"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Секция с функции */}
                <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    Всичко необходимо за управление на вашето
                                    студио
                                </h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    От планиране на репетиции до проследяване на
                                    плащания – разполагате с всички инструменти,
                                    за да се фокусирате върху най-важното –
                                    създаването на невероятна хореография.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                            <Card className="relative overflow-hidden">
                                <CardHeader>
                                    <Calendar className="h-10 w-10 text-blue-600" />
                                    <CardTitle>
                                        Проследяване на репетиции
                                    </CardTitle>
                                    <CardDescription>
                                        Планирайте и следете всички репетиции с
                                        подробна информация за присъствия и
                                        напредък.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Интелигентна система за график
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Отчитане на присъствия
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Документация за напредък
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden">
                                <CardHeader>
                                    <DollarSign className="h-10 w-10 text-green-600" />
                                    <CardTitle>
                                        Управление на плащания
                                    </CardTitle>
                                    <CardDescription>
                                        Следете всички плащания, фактури и
                                        финансови отчети на едно място.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Автоматизирано фактуриране
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Проследяване на плащанията
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Финансови отчети
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden">
                                <CardHeader>
                                    <Users className="h-10 w-10 text-blue-600" />
                                    <CardTitle>Организация на групи</CardTitle>
                                    <CardDescription>
                                        Управлявайте множество танцови групи и
                                        хореографи с разширени администраторски
                                        инструменти.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Управление на множество групи
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Профили на хореографи
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            История на дейности
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Администраторски функции */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50  flex justify-center">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                            <div className="space-y-4">
                                <Badge variant="outline" className="w-fit">
                                    Администраторско табло
                                </Badge>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                    Мощни администраторски инструменти
                                </h2>
                                <p className="text-muted-foreground md:text-lg">
                                    Пълен контрол върху вашата танцова
                                    организация чрез инструменти за управление
                                    на хореографи, проследяване на всички
                                    дейности и поддържане на история.
                                </p>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <BarChart3 className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <h3 className="font-semibold">
                                                Анализи и отчети
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Подробни справки и статистика
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <h3 className="font-semibold">
                                                История на дейности
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Пълен дневник на събитията
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <Image
                                    alt="Интерфейс на администраторско табло"
                                    className="aspect-video overflow-hidden rounded-xl object-cover shadow-lg"
                                    height="400"
                                    src="/management.jpg"
                                    width="600"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA секция */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-blue-700  flex justify-center">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Готови ли сте да трансформирате студиото си?
                                </h2>
                                <p className="mx-auto max-w-[600px] text-blue-100 md:text-xl">
                                    Присъединете се към стотици хореографи,
                                    които вече оптимизираха работния си процес с
                                    ChoreoPro. Започнете още днес.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="bg-white text-blue-600 hover:bg-gray-100"
                                >
                                    Започнете сега
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-muted-foreground">
                    © 2024 ChoreoPro. Всички права запазени.
                </p>
            </footer>
        </div>
    );
}
