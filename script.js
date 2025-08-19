class MortgageCalculator {
    constructor() {
        this.data = {};
        this.results = {};
        this.charts = {};
        this.isCalculating = false;
    }

    // 将总增值率转换为年化增值率
    getAnnualPropertyAppreciationRate() {
        const loanTermYears = this.data.loanTerm / 12;
        const totalAppreciationRate = parseFloat(document.getElementById('property-appreciation').value) / 100 || 0.1;
        // 从总增值率计算年化增值率：(1 + 总增值率)^(1/年数) - 1
        return Math.pow(1 + totalAppreciationRate, 1 / loanTermYears) - 1;
    }

    // 获取表单数据
    getFormData() {
        this.data = {
            // 财务情况 (存款、公积金余额按万元计算)
            savings: parseFloat(document.getElementById('savings').value) || 0, // 万元
            housingFundBalance: parseFloat(document.getElementById('housing-fund-balance').value) || 0, // 万元
            monthlyIncome: parseFloat(document.getElementById('monthly-income').value) || 0, // 元
            monthlyHousingFund: parseFloat(document.getElementById('monthly-housing-fund').value) || 0, // 元
            monthlyExpenses: parseFloat(document.getElementById('monthly-expenses').value) || 0, // 元
            
            // 租房情况
            rent: parseFloat(document.getElementById('rent').value) || 0, // 元
            monthlyRent: parseFloat(document.getElementById('rent').value) || 0, // 月租金，元
            rentGrowthRate: parseFloat(document.getElementById('rent-growth-rate')?.value) / 100 || 0.03, // 租金年增长率，默认3%
            
            // 计划买房情况 (房价、贷款按万元计算)
            location: document.getElementById('location').value,
            housePrice: parseFloat(document.getElementById('house-price').value) || 0, // 万元
            downPayment: parseFloat(document.getElementById('down-payment').value) || 0, // 万元
            housingFundLoan: parseFloat(document.getElementById('housing-fund-loan').value) || 0, // 万元
            commercialLoan: parseFloat(document.getElementById('commercial-loan').value) || 0, // 万元
            loanTerm: parseInt(document.getElementById('loan-term').value) || 240,
            housingFundRepayment: document.querySelector('input[name="housing-fund-repayment"]:checked').value,
            commercialRepayment: document.querySelector('input[name="commercial-repayment"]:checked').value,
            rentDuration: parseFloat(document.getElementById('rent-duration').value) || 0, // 年
            
            // 宏观指标 (利率按%输入并转换为小数)
            commercialRate: parseFloat(document.getElementById('commercial-rate').value) / 100 || 0.0305,
            housingFundRate: parseFloat(document.getElementById('housing-fund-rate').value) / 100 || 0.026,
            inflationRate: parseFloat(document.getElementById('inflation-rate').value) / 100 || 0.001,
            investmentReturn: parseFloat(document.getElementById('investment-return').value) / 100 || 0.05,
            
            // 计算输出设置 (从总增值率转换为年化增值率)
            propertyAppreciation: 0, // 临时占位，稍后计算
            unemploymentMonths: parseInt(document.getElementById('unemployment-months').value) || 480
        };
        
        // 计算年化房产增值率
        this.data.propertyAppreciation = this.getAnnualPropertyAppreciationRate();
    }

    // 计算等额本息月供
    calculateEqualPayment(principal, rate, months) {
        const monthlyRate = rate / 12;
        if (monthlyRate === 0) return principal / months;
        return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    // 计算等额本金月供
    calculateEqualPrincipal(principal, rate, months, currentMonth) {
        const monthlyPrincipal = principal / months;
        const remainingPrincipal = principal - monthlyPrincipal * (currentMonth - 1);
        const monthlyInterest = remainingPrincipal * rate / 12;
        return monthlyPrincipal + monthlyInterest;
    }

    // 计算月供详情
    calculateMonthlyPayment() {
        let housingFundPayment = 0;
        let commercialPayment = 0;

        if (this.data.housingFundLoan > 0) {
            if (this.data.housingFundRepayment === 'equal-payment') {
                housingFundPayment = this.calculateEqualPayment(
                    this.data.housingFundLoan * 10000, // 万元转换为元
                    this.data.housingFundRate,
                    this.data.loanTerm
                );
            } else {
                housingFundPayment = this.calculateEqualPrincipal(
                    this.data.housingFundLoan * 10000, // 万元转换为元
                    this.data.housingFundRate,
                    this.data.loanTerm,
                    1
                );
            }
        }

        if (this.data.commercialLoan > 0) {
            if (this.data.commercialRepayment === 'equal-payment') {
                commercialPayment = this.calculateEqualPayment(
                    this.data.commercialLoan * 10000, // 万元转换为元
                    this.data.commercialRate,
                    this.data.loanTerm
                );
            } else {
                commercialPayment = this.calculateEqualPrincipal(
                    this.data.commercialLoan * 10000, // 万元转换为元
                    this.data.commercialRate,
                    this.data.loanTerm,
                    1
                );
            }
        }

        return {
            housingFund: housingFundPayment,
            commercial: commercialPayment,
            total: housingFundPayment + commercialPayment
        };
    }

    // 计算总利息
    calculateTotalInterest() {
        const housingFundTotal = this.data.housingFundLoan * 10000;
        const commercialTotal = this.data.commercialLoan * 10000;
        
        let housingFundInterest = 0;
        let commercialInterest = 0;

        if (this.data.housingFundLoan > 0) {
            if (this.data.housingFundRepayment === 'equal-payment') {
                const monthlyPayment = this.calculateEqualPayment(housingFundTotal, this.data.housingFundRate, this.data.loanTerm);
                housingFundInterest = monthlyPayment * this.data.loanTerm - housingFundTotal;
            } else {
                housingFundInterest = (housingFundTotal * this.data.housingFundRate * (this.data.loanTerm + 1)) / 24;
            }
        }

        if (this.data.commercialLoan > 0) {
            if (this.data.commercialRepayment === 'equal-payment') {
                const monthlyPayment = this.calculateEqualPayment(commercialTotal, this.data.commercialRate, this.data.loanTerm);
                commercialInterest = monthlyPayment * this.data.loanTerm - commercialTotal;
            } else {
                commercialInterest = (commercialTotal * this.data.commercialRate * (this.data.loanTerm + 1)) / 24;
            }
        }

        return {
            housingFund: housingFundInterest,
            commercial: commercialInterest,
            total: housingFundInterest + commercialInterest
        };
    }

    // 计算房贷余额
    calculateRemainingLoan(year) {
        const monthsElapsed = year * 12;
        if (monthsElapsed >= this.data.loanTerm) {
            return 0; // 贷款已还清
        }

        let remainingHousingFund = 0;
        let remainingCommercial = 0;

        // 计算公积金贷款余额
        if (this.data.housingFundLoan > 0) {
            const principal = this.data.housingFundLoan * 10000;
            const monthlyRate = this.data.housingFundRate / 12;
            
            if (this.data.housingFundRepayment === 'equal-payment') {
                // 等额本息余额计算
                if (monthlyRate === 0) {
                    remainingHousingFund = principal * (1 - monthsElapsed / this.data.loanTerm);
                } else {
                    const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, this.data.loanTerm) / (Math.pow(1 + monthlyRate, this.data.loanTerm) - 1);
                    remainingHousingFund = monthlyPayment * (Math.pow(1 + monthlyRate, this.data.loanTerm) - Math.pow(1 + monthlyRate, monthsElapsed)) / monthlyRate;
                }
            } else {
                // 等额本金余额计算
                const monthlyPrincipal = principal / this.data.loanTerm;
                remainingHousingFund = principal - monthlyPrincipal * monthsElapsed;
            }
        }

        // 计算商业贷款余额
        if (this.data.commercialLoan > 0) {
            const principal = this.data.commercialLoan * 10000;
            const monthlyRate = this.data.commercialRate / 12;
            
            if (this.data.commercialRepayment === 'equal-payment') {
                // 等额本息余额计算
                if (monthlyRate === 0) {
                    remainingCommercial = principal * (1 - monthsElapsed / this.data.loanTerm);
                } else {
                    const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, this.data.loanTerm) / (Math.pow(1 + monthlyRate, this.data.loanTerm) - 1);
                    remainingCommercial = monthlyPayment * (Math.pow(1 + monthlyRate, this.data.loanTerm) - Math.pow(1 + monthlyRate, monthsElapsed)) / monthlyRate;
                }
            } else {
                // 等额本金余额计算
                const monthlyPrincipal = principal / this.data.loanTerm;
                remainingCommercial = principal - monthlyPrincipal * monthsElapsed;
            }
        }

        return (remainingHousingFund + remainingCommercial) / 10000; // 转换回万元
    }

    // 1. 财富总值对比
    calculateWealthComparison() {
        const years = 40;
        const monthlyPayment = this.calculateMonthlyPayment();
        const rentYears = this.data.rentDuration; // 已经是年为单位
        
        const wealthData = {
            rental: [],
            buying: []
        };

        for (let year = 0; year <= years; year++) {
            let rentalWealth = 0;
    
            if (year === 0) {
                // 第0年：初始资产
                rentalWealth = this.data.savings + this.data.housingFundBalance;
            } else {
                // 计算累积现金流
                const yearlyNetCashflow = (this.data.monthlyIncome + this.data.monthlyHousingFund - this.data.monthlyExpenses - this.data.rent) * 12 / 10000;
                
                // 初始资产投资增值
                const initialInvestmentValue = (this.data.savings + this.data.housingFundBalance) * Math.pow(1 + this.data.investmentReturn, year);
                
                // 每年净现金流的复合增值（假设年中投入）
                let cashflowInvestmentValue = 0;
                for (let i = 1; i <= year; i++) {
                    cashflowInvestmentValue += yearlyNetCashflow * Math.pow(1 + this.data.investmentReturn, year - i + 0.5);
                }
                
                rentalWealth = initialInvestmentValue + cashflowInvestmentValue;
            }

            // 买房财富总值计算
            let buyingWealth = 0;

            if (year === 0) {
                // 第0年：初始资产 - 首付
                buyingWealth = this.data.savings + this.data.housingFundBalance - this.data.downPayment;
                buyingWealth += this.data.housePrice; // 加上房产价值
                buyingWealth -= (this.data.housingFundLoan + this.data.commercialLoan); // 减去房贷
            } else {
                // 计算各项现金流
                let yearlyNetCashflow = (this.data.monthlyIncome + this.data.monthlyHousingFund - this.data.monthlyExpenses - monthlyPayment.total) * 12 / 10000;
                
                // 买房前的租房支出
                if (year <= rentYears) {
                    yearlyNetCashflow -= this.data.rent * 12 / 10000;
                }
                
                // 初始净资产（首付后剩余）
                const initialNetAssets = this.data.savings + this.data.housingFundBalance - this.data.downPayment;
                
                // 现金部分的投资增值
                let cashInvestmentValue = 0;
                if (initialNetAssets > 0) {
                    cashInvestmentValue = initialNetAssets * Math.pow(1 + this.data.investmentReturn, year);
                }
                
                // 累积现金流的投资增值
                let cashflowInvestmentValue = 0;
                for (let i = 1; i <= year; i++) {
                    if (yearlyNetCashflow > 0) {
                        cashflowInvestmentValue += yearlyNetCashflow * Math.pow(1 + this.data.investmentReturn, year - i + 0.5);
                    }
                }
                
                // 房产当前价值
                const currentHouseValue = this.data.housePrice * Math.pow(1 + this.data.propertyAppreciation, year);
                
                // 计算实际房贷余额
                const remainingLoan = this.calculateRemainingLoan(year);
                
                buyingWealth = cashInvestmentValue + cashflowInvestmentValue + currentHouseValue - remainingLoan;
            }
            
            wealthData.rental.push(Math.round(rentalWealth));
            wealthData.buying.push(Math.round(buyingWealth));
        }

        this.results.wealthComparison = wealthData;
        
        const final20Year = {
            rental: wealthData.rental[20],
            buying: wealthData.buying[20]
        };

        const final30Year = {
            rental: wealthData.rental[30],
            buying: wealthData.buying[30]
        };

        const final40Year = {
            rental: wealthData.rental[40],
            buying: wealthData.buying[40]
        };

        return {
            twentyYear: final20Year,
            thirtyYear: final30Year,
            fortyYear: final40Year,
            chartData: wealthData
        };
    }

    // 2. 月供压力评估
    calculatePaymentPressure() {
        const monthlyPayment = this.calculateMonthlyPayment();
        const pressureRatio = (monthlyPayment.total / (this.data.monthlyIncome + this.data.monthlyHousingFund) * 100).toFixed(2);
        
        // 生成月供详情表
        const paymentDetails = [];
        for (let month = 1; month <= 5; month++) {
            let hfPayment = 0, hfPrincipal = 0, hfInterest = 0;
            let comPayment = 0, comPrincipal = 0, comInterest = 0;

            if (this.data.housingFundLoan > 0) {
                const totalLoan = this.data.housingFundLoan * 10000;
                const monthlyRate = this.data.housingFundRate / 12;
                
                if (this.data.housingFundRepayment === 'equal-payment') {
                    hfPayment = this.calculateEqualPayment(totalLoan, this.data.housingFundRate, this.data.loanTerm);
                    
                    // 正确的剩余本金计算
                    const remainingBalance = totalLoan * (Math.pow(1 + monthlyRate, this.data.loanTerm) - Math.pow(1 + monthlyRate, month - 1)) / (Math.pow(1 + monthlyRate, this.data.loanTerm) - 1);
                    
                    hfInterest = remainingBalance * monthlyRate;
                    hfPrincipal = hfPayment - hfInterest;
                } else {
                    // 等额本金
                    hfPrincipal = totalLoan / this.data.loanTerm;
                    const remainingBalance = totalLoan - hfPrincipal * (month - 1);
                    hfInterest = remainingBalance * monthlyRate;
                    hfPayment = hfPrincipal + hfInterest;
                }
            }

            if (this.data.commercialLoan > 0) {
                if (this.data.commercialRepayment === 'equal-payment') {
                    comPayment = this.calculateEqualPayment(this.data.commercialLoan * 10000, this.data.commercialRate, this.data.loanTerm);
                    // 计算该月的剩余本金
                    const monthlyRate = this.data.commercialRate / 12;
                    const remainingBalance = comPayment * (Math.pow(1 + monthlyRate, this.data.loanTerm) - Math.pow(1 + monthlyRate, month - 1)) / monthlyRate;
                    comInterest = remainingBalance * monthlyRate;
                    comPrincipal = comPayment - comInterest;
                } else {
                    comPayment = this.calculateEqualPrincipal(this.data.commercialLoan * 10000, this.data.commercialRate, this.data.loanTerm, month);
                    comPrincipal = (this.data.commercialLoan * 10000) / this.data.loanTerm;
                    const remainingBalance = this.data.commercialLoan * 10000 - comPrincipal * (month - 1);
                    comInterest = remainingBalance * this.data.commercialRate / 12;
                }
            }

            paymentDetails.push({
                month: month,
                hf: {
                    total: Math.round(hfPayment),
                    principal: Math.round(hfPrincipal),
                    interest: Math.round(hfInterest)
                },
                com: {
                    total: Math.round(comPayment),
                    principal: Math.round(comPrincipal),
                    interest: Math.round(comInterest)
                }
            });
        }

        const totalInterest = this.calculateTotalInterest();

        return {
            monthlyPayment: Math.round(monthlyPayment.total),
            housePrice: this.data.housePrice,
            pressureRatio: pressureRatio,
            paymentDetails: paymentDetails,
            totalInterest: {
                commercial: Math.round(totalInterest.commercial),
                housingFund: Math.round(totalInterest.housingFund),
                total: Math.round(totalInterest.total)
            }
        };
    }

    // 3. 月度支出占比
    calculateExpenseRatio() {
        const monthlyPayment = this.calculateMonthlyPayment();
        const totalIncome = this.data.monthlyIncome + this.data.monthlyHousingFund;
        
        // 租房总支出 = 固定支出 + 房租
        const rentalExpense = this.data.monthlyExpenses + this.data.rent;
        const rentalRatio = (rentalExpense / totalIncome * 100).toFixed(2);
        
        // 买房总支出 = 固定支出 + 月供
        const buyingExpense = this.data.monthlyExpenses + monthlyPayment.total;
        const buyingRatio = (buyingExpense / totalIncome * 100).toFixed(2);

        const duration = Math.ceil(this.data.loanTerm / 12); // 贷款期限年数

        return {
            duration: duration,
            rental: {
                ratio: rentalRatio,
                amount: Math.round(rentalExpense)
            },
            buying: {
                ratio: buyingRatio,
                amount: Math.round(buyingExpense)
            }
        };
    }

    // 4. 房价涨幅盈亏临界点
    calculateBreakEvenPoint() {
        const targetYear = 20;
        
        // 计算20年后的财富对比
        const comparison = this.calculateWealthComparison();
        const rentalWealth = comparison.twentyYear.rental;
        const buyingWealth = comparison.twentyYear.buying;
        
        // 直接计算需要的总涨幅：租房财富 / 买房财富
        const requiredTotalAppreciation = (rentalWealth / buyingWealth) - 1;
        
        // 计算当前设定的总增值率
        const currentTotalAppreciation = Math.pow(1 + this.data.propertyAppreciation, targetYear) - 1;
        
        return {
            years: targetYear,
            requiredAppreciation: (requiredTotalAppreciation * 100).toFixed(2),
            currentAppreciation: (currentTotalAppreciation * 100).toFixed(2),
            isWorthBuying: currentTotalAppreciation >= requiredTotalAppreciation
        };
    }

    // 5. 筛选目标区域房源
    calculateHouseSelection() {
        const monthlyIncome = this.data.monthlyIncome;
        const monthlyHousingFund = this.data.monthlyHousingFund;
        const monthlyExpenses = this.data.monthlyExpenses || 0;
        const availableIncome = monthlyIncome + monthlyHousingFund - monthlyExpenses;
        
        // 计算公积金贷款上限
        const maxHfLoan = this.calculateMaxHousingFundLoan();
        
        // 计算可用资金
        const availableFunds = (this.data.savings + this.data.housingFundBalance) * 10000;
        
        // 计算不同还款压力下的可负担情况
        const scenarios = [
            { ratio: 0.2, description: '20%（轻松）' },
            { ratio: 0.3, description: '30%（适中）' },
            { ratio: 0.4, description: '40%（偏紧）' },
            { ratio: 0.5, description: '50%（紧张）' },
            { ratio: 0.6, description: '60%（极限）' }
        ];

        const results = scenarios.map(scenario => {
            // 总的可承受月供
            const totalPaymentLimit = availableIncome * scenario.ratio;
            
            // 优先使用公积金贷款（利率更低）
            const hfPaymentLimit = Math.min(
                totalPaymentLimit * 0.6, // 公积金贷款最多占总月供的60%
                this.calculatePaymentFromLoan(maxHfLoan, this.data.housingFundRate, this.data.loanTerm)
            );
            const actualHfLoan = Math.min(
                maxHfLoan,
                this.calculateLoanFromPayment(hfPaymentLimit, this.data.housingFundRate, this.data.loanTerm)
            );
            
            // 剩余月供用于商业贷款
            const remainingPayment = totalPaymentLimit - hfPaymentLimit;
            const comLoanAmount = this.calculateLoanFromPayment(
                remainingPayment, 
                this.data.commercialRate, 
                this.data.loanTerm
            );
            
            const totalLoan = actualHfLoan + comLoanAmount;
            
            // 根据首付比例计算最大房价
            const downPaymentRatio = this.data.downPaymentRatio || 0.3; // 默认30%
            const maxHousePrice = totalLoan / (1 - downPaymentRatio);
            const requiredDownPayment = maxHousePrice * downPaymentRatio;
            
            // 检查首付能力
            const affordableHousePrice = availableFunds < requiredDownPayment ? 
                availableFunds / downPaymentRatio : maxHousePrice;

            return {
                paymentRatio: scenario.description,
                totalPaymentLimit: Math.round(totalPaymentLimit),
                hfLoan: Math.round(actualHfLoan / 10000),
                hfPayment: Math.round(hfPaymentLimit),
                comLoan: Math.round(comLoanAmount / 10000),
                comPayment: Math.round(remainingPayment),
                totalLoan: Math.round(totalLoan / 10000),
                maxHousePrice: Math.round(maxHousePrice / 10000),
                requiredDownPayment: Math.round(requiredDownPayment / 10000),
                affordableHousePrice: Math.round(affordableHousePrice / 10000),
                isAffordable: availableFunds >= requiredDownPayment
            };
        });

        // 当前设定的贷款情况分析
        const currentPayment = this.calculateMonthlyPayment();
        const currentTotal = currentPayment.housingFund + currentPayment.commercial;
        const currentPaymentRatio = (currentTotal / availableIncome * 100).toFixed(1);

        // 计算最小和最大贷款金额
        const minLoan = results.length > 0 ? results[0].totalLoan : 0;
        const maxLoan = results.length > 0 ? results[results.length - 1].totalLoan : 0;
        
        return {
            availableIncome: Math.round(availableIncome),
            maxHfLoan: Math.round(maxHfLoan / 10000),
            currentPayment: Math.round(currentTotal),
            currentPaymentRatio: currentPaymentRatio + '%',
            scenarios: results,
            minLoan: minLoan,
            maxLoan: maxLoan,
            recommendation: this.generateHouseRecommendation(results)
        };
    }

    // 计算公积金贷款上限
    calculateMaxHousingFundLoan() {
        const policyLimit = this.data.hfLoanLimit || 600000; // 默认60万个人上限
        
        // 基于还款能力的上限（一般公积金月缴存额可以覆盖月供）
        const paymentBasedLimit = this.calculateLoanFromPayment(
            this.data.monthlyHousingFund * 0.8, // 80%的公积金收入用于还贷
            this.data.housingFundRate,
            this.data.loanTerm
        );
        
        return Math.min(policyLimit, paymentBasedLimit);
    }

    // 根据贷款计算月供
    calculatePaymentFromLoan(loanAmount, annualRate, termMonths) {
        if (loanAmount <= 0) return 0;
        
        const monthlyRate = annualRate / 12;
        const payment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / 
                    (Math.pow(1 + monthlyRate, termMonths) - 1);
        
        return payment;
    }

    // 根据月供计算可贷款额
    calculateLoanFromPayment(payment, annualRate, termMonths) {
        if (payment <= 0) return 0;
        
        const monthlyRate = annualRate / 12;
        const loanAmount = payment * (Math.pow(1 + monthlyRate, termMonths) - 1) / 
                        (monthlyRate * Math.pow(1 + monthlyRate, termMonths));
        
        return loanAmount;
    }

    // 生成购房建议
    generateHouseRecommendation(results) {
        const affordable = results.filter(r => r.isAffordable);
        
        if (affordable.length === 0) {
            return {
                type: 'insufficient_funds',
                message: '当前资金不足以支付首付，建议继续储蓄或考虑较低价位房源',
                suggestion: '建议首付目标：' + Math.round(results[0].requiredDownPayment) + '万元'
            };
        }
        
        const recommended = affordable.find(r => r.paymentRatio.includes('30%'));
        if (recommended) {
            return {
                type: 'recommended',
                message: '推荐选择30%还款压力的方案，既能承受又有余力',
                housePrice: recommended.affordableHousePrice + '万元以内',
                monthlyPayment: recommended.totalPaymentLimit + '元/月'
            };
        }
        
        return {
            type: 'cautious',
            message: '建议选择较低还款压力，确保生活质量',
            suggestion: affordable[0]
        };
    }

    // 生成建议
    generateRecommendations() {
        const wealthComparison = this.calculateWealthComparison();
        const paymentPressure = this.calculatePaymentPressure();
        
        const recommendations = [];

        // 财富对比建议
        const wealth30Rental = wealthComparison.thirtyYear.rental;
        const wealth30Buying = wealthComparison.thirtyYear.buying;
        
        if (wealth30Rental > wealth30Buying) {
            recommendations.push(`💰 <strong>财富积累角度</strong>：租房30年后财富总值为${wealth30Rental.toLocaleString()}万元，比买房多${(wealth30Rental - wealth30Buying).toLocaleString()}万元，建议继续租房。`);
        } else {
            recommendations.push(`🏠 <strong>财富积累角度</strong>：买房30年后财富总值为${wealth30Buying.toLocaleString()}万元，比租房多${(wealth30Buying - wealth30Rental).toLocaleString()}万元，建议考虑买房。`);
        }

        // 月供压力建议
        if (paymentPressure.pressureRatio > 50) {
            recommendations.push(`⚠️ <strong>月供压力</strong>：月供占收入${paymentPressure.pressureRatio}%，压力较大，建议考虑降低房价预算或增加首付比例。`);
        } else if (paymentPressure.pressureRatio > 30) {
            recommendations.push(`💡 <strong>月供压力</strong>：月供占收入${paymentPressure.pressureRatio}%，压力适中，可以考虑买房。`);
        } else {
            recommendations.push(`✅ <strong>月供压力</strong>：月供占收入${paymentPressure.pressureRatio}%，压力较小，买房较为轻松。`);
        }

        // 房价增值建议
        const breakEven = this.calculateBreakEvenPoint();
        recommendations.push(`📊 <strong>房价增值临界点</strong>：当房价总增值率达到${breakEven.requiredAppreciation}%时，买房开始划算。当前设定为${breakEven.currentAppreciation}%。`);

        // 综合建议
        let finalRecommendation = '';
        if (wealth30Rental > wealth30Buying && paymentPressure.pressureRatio > 40) {
            finalRecommendation = '🎯 <strong>综合建议</strong>：基于当前参数，建议继续租房，将资金用于投资，能获得更好的财务回报和资金灵活性。';
        } else if (wealth30Buying > wealth30Rental && paymentPressure.pressureRatio < 40) {
            finalRecommendation = '🎯 <strong>综合建议</strong>：基于当前参数，建议买房，既能获得更好的财富积累，月供压力也在可承受范围内。';
        } else {
            finalRecommendation = '🎯 <strong>综合建议</strong>：租房和买房各有优势，建议根据个人偏好和风险承受能力做出选择。可以调整参数重新计算。';
        }
        
        recommendations.push(finalRecommendation);

        return recommendations;
    }

    // 显示错误信息
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<strong>计算失败:</strong> ${message}`;
        
        const resultsSection = document.getElementById('results');
        resultsSection.style.display = 'block';
        resultsSection.innerHTML = '';
        resultsSection.appendChild(errorDiv);
        
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // 执行计算
    async calculateAll() {
        if (this.isCalculating) {
            return; // 防止重复计算
        }

        this.isCalculating = true;
        this.getFormData();
        
        try {
            // 执行所有计算
            const wealthResult = this.calculateWealthComparison();
            const paymentResult = this.calculatePaymentPressure();
            const expenseResult = this.calculateExpenseRatio();
            const breakEvenResult = this.calculateBreakEvenPoint();
            const selectionResult = this.calculateHouseSelection();
            const recommendations = this.generateRecommendations();

            // 显示结果
            this.displayResults({
                wealth: wealthResult,
                payment: paymentResult,
                expense: expenseResult,
                breakEven: breakEvenResult,
                selection: selectionResult,
                recommendations: recommendations
            });
        } catch (error) {
            console.error('计算错误:', error);
            this.showError('计算失败: ' + error.message);
        } finally {
            this.isCalculating = false;
        }
    }

    // 安全获取DOM元素
    safeGetElement(elementId) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with ID '${elementId}' not found`);
            return null;
        }
        return element;
    }

    // 安全设置innerHTML
    safeSetInnerHTML(elementId, content) {
        const element = this.safeGetElement(elementId);
        if (element) {
            element.innerHTML = content;
        }
    }

    // 显示结果
    displayResults(results) {
        const resultsElement = this.safeGetElement('results');
        if (!resultsElement) {
            console.error('Results container not found');
            return;
        }
        
        // 检查必要的结果数据
        if (!results.wealth || !results.wealth.thirtyYear || 
            results.wealth.thirtyYear.rental === undefined || 
            results.wealth.thirtyYear.buying === undefined) {
            console.error('财富对比数据缺失:', results.wealth);
            this.showError('计算结果数据不完整，请检查输入参数');
            return;
        }
        
        resultsElement.style.display = 'block';
        
        // 1. 财富总值对比
        this.safeSetInnerHTML('wealth-comparison-result', `
            <div class="result-summary">
                <p><strong>${Math.ceil(this.data.loanTerm / 12)}年后，贷款还清时，财富总值：</strong></p>
                <p class="highlight">租房 ¥${results.wealth.thirtyYear.rental.toLocaleString()}万 ${results.wealth.thirtyYear.rental > results.wealth.thirtyYear.buying ? '>' : '<'} 买房 ¥${results.wealth.thirtyYear.buying.toLocaleString()}万</p>
                <p><strong>40年后，租房的财富总值比买房${results.wealth.fortyYear.rental > results.wealth.fortyYear.buying ? '高' : '低'}。</strong></p>
                <div class="note">
                    <p><strong>备注：</strong></p>
                    <p>• 租房的财富总值 = 现有存款和公积金余额 + 税后收入和公积金余额 + 投资回报金额 - 固定支出 - 租房支出。</p>
                    <p>• 买房的财富总值 = 现有存款和公积金余额 + 税后收入和公积金余额 + 投资回报金额 - 固定支出 - 买房支出 - 首付金额 + 房产价值 - 房贷余额。</p>
                </div>
            </div>
        `);
        this.createWealthChart(results.wealth.chartData);

        // 2. 月供压力评估
        let paymentTableHtml = `
            <table class="payment-table">
                <thead>
                    <tr>
                        <th rowspan="2">月数</th>
                        <th colspan="3">商贷</th>
                        <th colspan="3">公积金贷</th>
                    </tr>
                    <tr>
                        <th>本月还款总额</th><th>本月还款本金</th><th>本月还款利息</th>
                        <th>本月还款总额</th><th>本月还款本金</th><th>本月还款利息</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        results.payment.paymentDetails.forEach(detail => {
            paymentTableHtml += `
                <tr>
                    <td>${detail.month}</td>
                    <td>${detail.com.total.toLocaleString()}</td>
                    <td>${detail.com.principal.toLocaleString()}</td>
                    <td>${detail.com.interest.toLocaleString()}</td>
                    <td>${detail.hf.total.toLocaleString()}</td>
                    <td>${detail.hf.principal.toLocaleString()}</td>
                    <td>${detail.hf.interest.toLocaleString()}</td>
                </tr>
            `;
        });
        paymentTableHtml += '</tbody></table>';

        this.safeSetInnerHTML('payment-pressure-result', `
            <div class="result-summary">
                <p class="highlight">¥${results.payment.housePrice}万房子的商业贷款和公积金贷款总月供为 ¥${results.payment.monthlyPayment.toLocaleString()}，占您税后收入的 ${results.payment.pressureRatio}%。</p>
                <p>该比例可帮助您判断还款压力是否在合理范围内。</p>
            </div>
        `);
        
        this.safeSetInnerHTML('payment-details', paymentTableHtml + `
            <div class="summary-box">
                <p><strong>总结：</strong></p>
                <p>• 商贷还款总额 ¥${(results.payment.totalInterest.commercial + this.data.commercialLoan * 10000).toLocaleString()}，其中本金 ¥${(this.data.commercialLoan * 10000).toLocaleString()}，利息 ¥${results.payment.totalInterest.commercial.toLocaleString()}</p>
                <p>• 公积金还款总额 ¥${(results.payment.totalInterest.housingFund + this.data.housingFundLoan * 10000).toLocaleString()}，其中本金 ¥${(this.data.housingFundLoan * 10000).toLocaleString()}，利息 ¥${results.payment.totalInterest.housingFund.toLocaleString()}</p>
            </div>
        `);

        // 3. 月度支出占比
        this.safeSetInnerHTML('expense-ratio-result', `
            <div class="result-summary">
                <p class="highlight">${results.expense.duration}年内，租房 ${results.expense.rental.ratio}% < 买房 ${results.expense.buying.ratio}%。</p>
            </div>
        `);

        // 4. 房价涨幅盈亏临界点
        this.safeSetInnerHTML('break-even-result', `
            <div class="result-summary">
                <p class="highlight">${results.breakEven.years}年后，房价需升值 ${results.breakEven.requiredAppreciation}%，买房才比租房划算。</p>
            </div>
        `);

        // 5. 筛选目标区域房源
        let selectionTableHtml = `
            <table class="selection-table">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>月供压力占比</th>
                        <th>公积金可贷额度</th>
                        <th>公积金月供</th>
                        <th>商业可贷额度</th>
                        <th>商业月供</th>
                        <th>贷款总额度</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        results.selection.scenarios.forEach((scenario, index) => {
            selectionTableHtml += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${scenario.paymentRatio}</td>
                    <td>${scenario.hfLoan.toLocaleString()}万</td>
                    <td>¥${scenario.hfPayment.toLocaleString()}</td>
                    <td>${scenario.comLoan.toLocaleString()}万</td>
                    <td>¥${scenario.comPayment.toLocaleString()}</td>
                    <td>${scenario.totalLoan.toLocaleString()}万</td>
                </tr>
            `;
        });
        selectionTableHtml += '</tbody></table>';

        this.safeSetInnerHTML('house-selection-result', `
            <div class="result-summary">
                <p>您当前可贷款金额最低为 ¥${results.selection.minLoan.toLocaleString()}万，可负担的房价最低为 ¥${results.selection.scenarios[0].maxHousePrice.toLocaleString()}万。</p>
                <p>您当前可贷款金额最高为 ¥${results.selection.maxLoan.toLocaleString()}万，可负担的房价最高为 ¥${results.selection.scenarios[results.selection.scenarios.length-1].maxHousePrice.toLocaleString()}万。</p>
                <p>不同比例的月供压力组合及对应的贷款额度详见下表：</p>
            </div>
        `);
        
        this.safeSetInnerHTML('house-selection-table', selectionTableHtml);

        // 推荐建议
        this.safeSetInnerHTML('recommendations', `
            <div class="recommendations">
                ${results.recommendations.map(rec => `<p>${rec}</p>`).join('')}
            </div>
        `);

        // 滚动到结果区域
        const scrollElement = this.safeGetElement('results');
        if (scrollElement) {
            scrollElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 创建财富对比图表
    createWealthChart(data) {
        const canvas = this.safeGetElement('wealth-chart');
        if (!canvas) {
            console.warn('Wealth chart canvas not found');
            return;
        }
        const ctx = canvas.getContext('2d');
        if (this.charts.wealth) {
            this.charts.wealth.destroy();
        }
        
        const years = Array.from({length: 41}, (_, i) => i);
        
        this.charts.wealth = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: '租房',
                    data: data.rental,
                    borderColor: '#4A90E2',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    fill: false
                }, {
                    label: '买房',
                    data: data.buying,
                    borderColor: '#7ED321',
                    backgroundColor: 'rgba(126, 211, 33, 0.1)',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '年'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '万元'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: '财富总值变化图'
                    }
                }
            }
        });
    }
}

// 初始化计算器
const calculator = new MortgageCalculator();

// 绑定事件
document.addEventListener('DOMContentLoaded', function() {
    // 设置默认值
    document.getElementById('savings').value = '300';
    document.getElementById('housing-fund-balance').value = '26';
    document.getElementById('monthly-income').value = '50000';
    document.getElementById('monthly-housing-fund').value = '16000';
    document.getElementById('monthly-expenses').value = '21000';
    document.getElementById('rent').value = '7000';
    document.getElementById('house-price').value = '500';
    document.getElementById('down-payment').value = '300';
    document.getElementById('housing-fund-loan').value = '80';
    document.getElementById('commercial-loan').value = '120';
    document.getElementById('rent-duration').value = '1';

    // 绑定计算按钮
    document.getElementById('calculate-btn').addEventListener('click', async function() {
        try {
            // 执行计算
            await calculator.calculateAll();
        } catch (error) {
            console.error('计算错误:', error);
            
            // 显示错误信息
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `<strong>计算错误:</strong> ${error.message}`;
            
            // 显示错误信息
            const resultsSection = document.getElementById('results');
            resultsSection.style.display = 'block';
            resultsSection.innerHTML = '';
            resultsSection.appendChild(errorDiv);
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // 添加表单验证
    const requiredFields = [
        'savings', 'housing-fund-balance', 'monthly-income', 
        'monthly-housing-fund', 'monthly-expenses', 'rent',
        'house-price', 'down-payment', 'housing-fund-loan', 
        'commercial-loan', 'rent-duration'
    ];

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(this);
            });
        }
    });
});

// 表单验证函数
function validateField(field) {
    const value = parseFloat(field.value);
    const fieldName = field.previousElementSibling.textContent;
    
    // 移除之前的错误样式
    field.classList.remove('error');
    
    // 基本验证
    if (field.hasAttribute('required') || field.value !== '') {
        if (isNaN(value) || value < 0) {
            field.classList.add('error');
            showFieldError(field, `${fieldName} 必须是有效的正数`);
            return false;
        }
    }
    
    // 特定字段的验证
    if (field.id === 'house-price' && value > 0 && value < 50) {
        field.classList.add('error');
        showFieldError(field, '房屋总价似乎过低，请检查是否为万元单位');
        return false;
    }
    
    if (field.id === 'down-payment') {
        const housePrice = parseFloat(document.getElementById('house-price').value) || 0;
        if (value > housePrice) {
            field.classList.add('error');
            showFieldError(field, '首付金额不能超过房屋总价');
            return false;
        }
    }
    
    // 清除错误信息
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}