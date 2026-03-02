// wplTournaments.js
// A dictionary mapping known WPL Tournament names to their actual Buy-in amounts (Stakes)

export const KNOWN_WPL_TOURNAMENTS = [
    {
        keywords: ["프리롤", "무료 토너먼트", "1,000만 GTD"],
        buyinStr: "0원",
        buyinValue: 0
    },
    {
        keywords: ["데일리 메인 1,300억 GTD", "1300억 GTD"],
        buyinStr: "4억",
        buyinValue: 4
    },
    {
        keywords: ["MAIN EVENT 10장 GTD", "메인 이벤트 10장 GTD"],
        buyinStr: "5억 5000만",
        buyinValue: 5.5
    },
    {
        keywords: ["데일리 미니 메인 130억 GTD"],
        buyinStr: "2500만",
        buyinValue: 0.25
    },
    {
        keywords: ["클래식 터보 14억 GTD"],
        buyinStr: "700만",
        buyinValue: 0.07
    },
    {
        keywords: ["몬스터 스택 400억 GTD"],
        buyinStr: "2억 3000만",
        buyinValue: 2.3
    },
    {
        keywords: ["러너러너 150억 GTD"],
        buyinStr: "1억 1000만",
        buyinValue: 1.1
    },
    {
        keywords: ["비기너즈 1억 GTD"],
        buyinStr: "25만",
        buyinValue: 0.0025
    },
    {
        keywords: ["비기너즈 8,000만 GTD", "비기너즈 8000만 GTD"],
        buyinStr: "30만",
        buyinValue: 0.003
    },
    {
        keywords: ["비기너즈 5,000만 GTD", "비기너즈 5000만 GTD"],
        buyinStr: "20만",
        buyinValue: 0.002
    },
    {
        keywords: ["비기너즈 3,000만 GTD", "비기너즈 3000만 GTD"],
        buyinStr: "15만",
        buyinValue: 0.0015
    },
    {
        keywords: ["데이브레이크 230억 GTD", "데이브레이크"],
        buyinStr: "2억",
        buyinValue: 2
    },
    {
        keywords: ["데이브레이크 180억 GTD"],
        buyinStr: "2억 8000만",
        buyinValue: 2.8
    },
    {
        keywords: ["데이브레이크 터보 9억 GTD"],
        buyinStr: "580만",
        buyinValue: 0.058
    },
    {
        keywords: ["데이브레이크 터보 3억 5,000만 GTD", "데이브레이크 터보 3억 5000만 GTD"],
        buyinStr: "300만",
        buyinValue: 0.03
    },
    {
        keywords: ["데이브레이크 터보 2억 5,000만 GTD", "데이브레이크 터보 2억 5000만 GTD"],
        buyinStr: "150만",
        buyinValue: 0.015
    },
    {
        keywords: ["바운티 헌터 6-MAX 터보 10억 GTD"],
        buyinStr: "1000만",
        buyinValue: 0.1
    },
    {
        keywords: ["바운티 헌터 50억 GTD"],
        buyinStr: "7000만",
        buyinValue: 0.7
    },
    {
        keywords: ["바운티 헌터 60억 GTD"],
        buyinStr: "7000만",
        buyinValue: 0.7
    },
    {
        keywords: ["콤팩트 필드 미니 30억 GTD"],
        buyinStr: "5000만",
        buyinValue: 0.5
    },
    {
        keywords: ["콤팩트 필드 미니 50억 GTD"],
        buyinStr: "8000만",
        buyinValue: 0.8
    },
    {
        keywords: ["콤팩트 필드 150억 GTD"],
        buyinStr: "2억 5000만",
        buyinValue: 2.5
    },
    {
        keywords: ["콤팩트 필드 330억 GTD"],
        buyinStr: "3억 7000만",
        buyinValue: 3.7
    },
    {
        keywords: ["스텝업 터보 2억 GTD"],
        buyinStr: "150만",
        buyinValue: 0.015
    },
    {
        keywords: ["스텝업 터보 3억 GTD"],
        buyinStr: "250만",
        buyinValue: 0.025
    },
    {
        keywords: ["스텝업 터보 4억 GTD"],
        buyinStr: "300만",
        buyinValue: 0.03
    },
    {
        keywords: ["스텝업 터보 8억 GTD"],
        buyinStr: "580만",
        buyinValue: 0.058
    },
    {
        keywords: ["클래식 터보 15억 GTD", "클래식 터보 13억 GTD"],
        buyinStr: "700만",
        buyinValue: 0.07
    },
    {
        keywords: ["클래식 터보 7억 5,000만 GTD", "클래식 터보 7억 5000만 GTD"],
        buyinStr: "520만",
        buyinValue: 0.052
    },
    {
        keywords: ["클래식 100억 GTD"],
        buyinStr: "1억 1000만",
        buyinValue: 1.1
    },
    {
        keywords: ["클래식 150억 GTD"],
        buyinStr: "1억 4000만",
        buyinValue: 1.4
    },
    {
        keywords: ["클래식 180억 GTD"],
        buyinStr: "1억 9000만",
        buyinValue: 1.9
    },
    {
        keywords: ["클래식 280억 GTD"],
        buyinStr: "2억 2000만",
        buyinValue: 2.2
    },
    {
        keywords: ["새틀라이트 [2.2억 티켓] 3장 GTD"],
        buyinStr: "2200만",
        buyinValue: 0.22
    },
    {
        keywords: ["스피드 레이스 80억 GTD"],
        buyinStr: "6000만",
        buyinValue: 0.6
    },
    {
        keywords: ["데이브레이크 230억 GTD", "데이브레이크"],
        buyinStr: "2억",
        buyinValue: 2
    },
    {
        keywords: ["데일리 메인 1,000억 GTD", "데일리 메인 1000억 GTD"],
        buyinStr: "3억 3000만",
        buyinValue: 3.3
    },
    {
        keywords: ["딥스택 1,200억 GTD", "딥스택 1200억 GTD"],
        buyinStr: "4억 4000만",
        buyinValue: 4.4
    },
    {
        keywords: ["선데이 빌리언즈 1,500억 GTD", "선데이 빌리언즈 1500억 GTD"],
        buyinStr: "5억 5000만",
        buyinValue: 5.5
    },
    {
        keywords: ["하이롤러 500억 GTD", "하이롤러"],
        buyinStr: "7억",
        buyinValue: 7
    },
    {
        keywords: ["루키즈 1,500억 GTD", "루키즈 1500억 GTD"],
        buyinStr: "6000만",
        buyinValue: 0.6
    },
    {
        keywords: ["스피드 레이스 바운티 230억 GTD"],
        buyinStr: "2억",
        buyinValue: 2
    },
    {
        keywords: ["마스터즈 5,000억 GTD", "마스터즈 5000억 GTD"],
        buyinStr: "5억 5000만",
        buyinValue: 5.5
    },
    {
        keywords: ["슈퍼 하이롤러 3,000억 GTD", "슈퍼 하이롤러 4,000억 GTD", "슈퍼 하이롤러"],
        buyinStr: "7억",
        buyinValue: 7
    },
    {
        keywords: ["스텝업 터보 9억 GTD"],
        buyinStr: "450만",
        buyinValue: 0.045
    },
    {
        keywords: ["비기너즈 2억 GTD"],
        buyinStr: "60만",
        buyinValue: 0.006
    },
    {
        keywords: ["5억 티켓 3장 GTD", "프리롤 - 5.5억 티켓"],
        buyinStr: "5500만",
        buyinValue: 0.55
    },
    {
        keywords: ["새틀라이트 [4억 티켓]"],
        buyinStr: "4000만",
        buyinValue: 0.4
    },
    {
        keywords: ["워밍업 230억 새틀라이트 [2.2억 티켓]"],
        buyinStr: "2200만",
        buyinValue: 0.22
    },
    {
        keywords: ["워밍업 터보 3억 GTD"],
        buyinStr: "180만",
        buyinValue: 0.018
    },
    {
        keywords: ["워밍업 터보 9억 GTD"],
        buyinStr: "1000만",
        buyinValue: 0.1
    },
    {
        keywords: ["워밍업 터보 11억 GTD"],
        buyinStr: "700만",
        buyinValue: 0.07
    },
    {
        keywords: ["클래식 터보 7억 GTD"],
        buyinStr: "520만",
        buyinValue: 0.052
    },
    {
        keywords: ["클래식 200억 GTD"],
        buyinStr: "1억 7000만",
        buyinValue: 1.7
    },
    {
        keywords: ["클래식 300억 GTD"],
        buyinStr: "2억 7000만",
        buyinValue: 2.7
    },
    {
        keywords: ["프리즈 아웃 80억 GTD"],
        buyinStr: "8000만",
        buyinValue: 0.8
    },
    {
        keywords: ["하이롤러 1000억 새틀라이트 [10억 티켓] 3장 GTD"],
        buyinStr: "1억",
        buyinValue: 1
    },
    {
        keywords: ["새틀라이트 [2.3억 티켓] 3장 GTD"],
        buyinStr: "2300만",
        buyinValue: 0.23
    },
    {
        keywords: ["새틀라이트 [2.7억 티켓] 3장 GTD"],
        buyinStr: "2700만",
        buyinValue: 0.27
    },
    {
        keywords: ["바운티 헌터 250억 GTD"],
        buyinStr: "3억 3100만",
        buyinValue: 3.31
    },
    {
        keywords: ["바운티 헌터 230억 GTD"],
        buyinStr: "2억 2000만",
        buyinValue: 2.2
    },
    {
        keywords: ["바운티 헌터 6-MAX 230억 GTD"],
        buyinStr: "3억 3100만",
        buyinValue: 3.31
    },
    {
        keywords: ["비기너즈 3억 GTD"],
        buyinStr: "70만",
        buyinValue: 0.007
    },
    {
        keywords: ["비기너즈 4억 GTD"],
        buyinStr: "120만",
        buyinValue: 0.012
    },
    {
        keywords: ["바운티 헌터 6-MAX 150억 GTD"],
        buyinStr: "1억 8000만",
        buyinValue: 1.8
    },
    {
        keywords: ["워밍업 230억 GTD"],
        buyinStr: "2억 2000만",
        buyinValue: 2.2
    },
    {
        keywords: ["WPL MAIN EVENT 15장 GTD"],
        buyinStr: "5억 5000만",
        buyinValue: 5.5
    },
    {
        keywords: ["클래식 터보 25억 GTD"],
        buyinStr: "1200만",
        buyinValue: 0.12
    },
    {
        keywords: ["콤팩트 필드 미니 35억 GTD"],
        buyinStr: "5500만",
        buyinValue: 0.55
    },
    {
        keywords: ["데이브레이크 230억 새틀라이트 [1.65억 티켓]"],
        buyinStr: "1650만",
        buyinValue: 0.165
    },
    {
        keywords: ["데이브레이크 터보 30억 GTD"],
        buyinStr: "2200만",
        buyinValue: 0.22
    },
    {
        keywords: ["콤팩트 필드 230억 GTD"],
        buyinStr: "3억 3100만",
        buyinValue: 3.31
    },
    {
        keywords: ["클래식 250억 새틀라이트 [2.2억 티켓]"],
        buyinStr: "2200만",
        buyinValue: 0.22
    },
    {
        keywords: ["미드나잇 350억 GTD"],
        buyinStr: "2억 7000만",
        buyinValue: 2.7
    },
    {
        keywords: ["프리롤 - 5.5억 티켓"],
        buyinStr: "0원",
        buyinValue: 0
    },
    {
        keywords: ["하이롤러 1000억 GTD"],
        buyinStr: "10억",
        buyinValue: 10
    },
    {
        keywords: ["바운티 헌터 6-MAX 120억 GTD"],
        buyinStr: "1억",
        buyinValue: 1
    },
    {
        keywords: ["데이브레이크 150억 GTD"],
        buyinStr: "1억 1000만",
        buyinValue: 1.1
    },
    {
        keywords: ["데이브레이크 터보 7억 5,000만 GTD", "데이브레이크 터보 7억 5000만 GTD"],
        buyinStr: "450만",
        buyinValue: 0.045
    },
    {
        keywords: ["비기너즈 1억 3,000만 GTD", "비기너즈 1억 3000만 GTD"],
        buyinStr: "50만",
        buyinValue: 0.005
    },
    {
        keywords: ["새틀 for 새틀 - 5.5억 티켓"],
        buyinStr: "5500만",
        buyinValue: 0.55
    },
    {
        keywords: ["바운티 헌터 120억 GTD"],
        buyinStr: "1억 6000만",
        buyinValue: 1.6
    },
    {
        keywords: ["클래식 35억 GTD"],
        buyinStr: "3500만",
        buyinValue: 0.35
    },
    {
        keywords: ["클래식 250억 GTD"],
        buyinStr: "2억 2000만",
        buyinValue: 2.2
    },
    {
        keywords: ["스텝업 터보 2억 5,000만 GTD", "스텝업 터보 2억 5000만 GTD"],
        buyinStr: "250만",
        buyinValue: 0.025
    },
    {
        keywords: ["비기너즈 1억 5,000만 GTD", "비기너즈 1억 5000만 GTD"],
        buyinStr: "60만",
        buyinValue: 0.006
    },
    {
        keywords: ["스피드 레이스 바운티 100억 GTD"],
        buyinStr: "1억 2000만",
        buyinValue: 1.2
    },
    {
        keywords: ["새틀라이트 [1.7억 티켓] 3장 GTD", "새틀라이트 [1.7억 티켓]"],
        buyinStr: "1700만",
        buyinValue: 0.17
    },
    {
        keywords: ["워밍업 25억 GTD"],
        buyinStr: "1700만",
        buyinValue: 0.17
    },
    {
        keywords: ["프리롤(무료 토너먼트) 5,000만 GTD"],
        buyinStr: "0원",
        buyinValue: 0
    },
    {
        keywords: ["프리롤(무료 토너먼트) 1억 GTD"],
        buyinStr: "0원",
        buyinValue: 0
    },
    {
        keywords: ["WPL 데일리 미니 메인 130억 GTD", "WPL 데일리 미니 메인"],
        buyinStr: "2500만",
        buyinValue: 0.25
    },
    {
        keywords: ["WPL 데일리 메인 1,300억 GTD", "WPL 데일리 메인 1300억 GTD"],
        buyinStr: "4억",
        buyinValue: 4
    },
    {
        keywords: ["WPL 데일리 메인 1,300억 새틀라이트 [4억 티켓]"],
        buyinStr: "4000만",
        buyinValue: 0.4
    },
    {
        keywords: ["바운티 헌터 6-MAX 150억 GTD"],
        buyinStr: "1억 8000만",
        buyinValue: 1.8
    },
    {
        keywords: ["스피드 레이스 바운티 100억 GTD"],
        buyinStr: "1억 2000만",
        buyinValue: 1.2
    },
    {
        keywords: ["새틀라이트 [10억 티켓] 3장 GTD", "새틀라이트 [10억 티켓]"],
        buyinStr: "1억",
        buyinValue: 1
    },
    {
        keywords: ["위켄드 빌리언즈"],
        buyinStr: "7억",
        buyinValue: 7
    }
];

/**
 * Tries to find the precise buy-in for a given tournament name.
 * Returns the buyin string (e.g. "2억 3000만") if found, otherwise returns null.
 */
export function getKnownWPLBuyin(tournamentName) {
    if (!tournamentName) return null;

    // Normalize string for better matching (remove spaces, brackets etc)
    const normalizedName = tournamentName.replace(/\s+/g, '').toLowerCase();

    for (const tourney of KNOWN_WPL_TOURNAMENTS) {
        // If ANY of the keywords match the tournament name, we consider it a hit
        const isMatch = tourney.keywords.some(keyword => {
            const normalizedKeyword = keyword.replace(/\s+/g, '').toLowerCase();
            return normalizedName.includes(normalizedKeyword);
        });

        if (isMatch) {
            return {
                str: tourney.buyinStr,
                val: tourney.buyinValue
            };
        }
    }
    return null;
}
