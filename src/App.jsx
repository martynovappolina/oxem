import mainStyle from './style/main.module.scss'
import inputStyle from  './style/input.module.scss'
import finalStyle from './style/final.module.scss'
import textStyle from './style/text.module.scss'
import titleStyle from './style/title.module.scss'
import { useCallback, useEffect, useState } from 'react'


const App = () => {
    useEffect(() => {
        document.title = 'Oxem';
        document.description = 'hello world))';
    }, [])

    const [meta, setMeta] = useState("initial")
    const [w1, setW1] = useState('0');
    const [w2, setW2] = useState('0');
    const [w3, setW3] = useState('0');

    const [autoPrice, setAutoPrise] = useState(1000000);
    const changeAutoPrice = useCallback(() => {
        setAutoPrise(autoPrice < 1000000? 1000000: autoPrice > 6000000? 6000000: autoPrice);
    }, [autoPrice]);
    const inputAutoPrice =  useCallback((e) => {
        setAutoPrise(e.target.value.toString().replace(/\s/g, ""))
    }, [autoPrice]);
    useEffect(() => {
        setW1(
            autoPrice < 1000000? 0 + 'px': autoPrice > 6000000? document.getElementById('line1').offsetWidth + 'px':
            (autoPrice - 1000000) / 5000000 * document.getElementById('line1').offsetWidth + 'px');
    }, [autoPrice])

    const[percent, setPercent] = useState(10)
    const [firstPayment, setFirstPayment] = useState(String(autoPrice * percent / 100) + ' ₽')
    const changePercent = useCallback(() => {
        setPercent(
            percent < 10? 10: percent > 60? 60: percent
        );
    }, [percent, firstPayment])
    const inputPercent =  useCallback((e) => {
        setPercent(e.target.value);
    }, [percent, firstPayment]);
    useEffect(() => {
        setFirstPayment(String(autoPrice * percent / 100) + ' ₽');
        setW2(
            percent < 10? 0 + 'px': percent > 60? document.getElementById('line2').offsetWidth + 'px':
            (percent - 10) / 50 * document.getElementById('line2').offsetWidth + 'px');
    }, [percent])

    const [period, setPeriod] = useState(1);
    const changePeriod = useCallback(() => {
        setPeriod(
            period < 1? 1: period > 60? 60: period
        );
    }, [period])
    const inputPeriod =  useCallback((e) => setPeriod(e.target.value), [period]);
    useEffect(() => {
        setW3(
            period < 1? 0 + 'px': period > 60? document.getElementById('line3').offsetWidth + 'px':
            (period - 1) / 59 * document.getElementById('line3').offsetWidth + 'px');
    }, [period])

    const[sum, setSum] = useState(0);
    const[monthlyPayment, setMonthlyPayment] = useState(0);
    
    useEffect(() => {
        setMonthlyPayment(
            parseInt(
            (autoPrice - parseFloat(firstPayment.substring(0, firstPayment.length - 1))) *
            (0.035 * Math.pow((1 + 0.035), period)) /
            (Math.pow((1 + 0.035), period) - 1)
        ));

        setSum(
            parseInt(
                parseFloat(firstPayment.substring(0, firstPayment.length - 1)) +
                period*monthlyPayment
            )
        );
    }, [autoPrice, percent, firstPayment, period, monthlyPayment])

    const postData = () => {
        setMeta("loading");
        fetch('https://eoj3r7f3r4ef6v4.m.pipedream.net', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'monthPay': monthlyPayment,
                'sum': sum,
            })
        }).then(() => setMeta("success")).catch(() => setMeta('error'))
    } 

    return (
        <div className={mainStyle.main}>
                <div className={titleStyle.title__container}>
                    <div className={titleStyle.title__text}>
                        Рассчитайте стоимость автомобиля в лизинг
                    </div>
                </div>
                <div className={inputStyle.input__main__container}>
                    <div className={inputStyle.input__line__container}>
                        <div className={textStyle.small__text}>Стоимость автомобиля</div>
                        <div className={inputStyle.input__line____container}>
                            <input className={inputStyle.input__line} name="line" value={autoPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} onChange={inputAutoPrice} onMouseLeave={changeAutoPrice}/>
                            <input type="range" className={inputStyle.input__range} id='line1' name="range" value={autoPrice} onChange={inputAutoPrice} min="1000000" max="6000000"/>
                            <div style={{width: w1}} className={inputStyle.input__range__progress}></div>
                            <div className={inputStyle.input__line__icon}>₽</div>
                        </div>
                    </div>

                    <div className={inputStyle.input__line__container}>
                        <div className={textStyle.small__text}>Первоначальный взнос</div>
                        <div className={inputStyle.input__line____container}>
                            <div className={inputStyle.input__line__passive}>{firstPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</div>
                            <input type="range" className={inputStyle.input__range} id='line2' name="range" value={percent} onChange={inputPercent} min="10" max="60" />
                            <div style={{width: w2}} className={inputStyle.input__range__progress}></div>
                            <input className={inputStyle.input__percent} value={percent} onChange={inputPercent} onMouseLeave={changePercent}></input>
                            <div className={inputStyle.input__percent__icon}>%</div>
                        </div>
                    </div>

                    <div className={inputStyle.input__line__container}>
                        <div className={textStyle.small__text}>Срок лизинга</div>
                        <div className={inputStyle.input__line____container}>
                            <input className={inputStyle.input__line} name="line" value={period} onChange={inputPeriod} onMouseLeave={changePeriod} />
                            <input type="range" id='line3' className={inputStyle.input__range} name="range" value={period} onChange={inputPeriod} min="1" max="60" />
                            <div style={{width: w3}} className={inputStyle.input__range__progress}></div>
                            <div className={inputStyle.input__line__icon}>мес.</div>
                        </div>
                    </div>
                </div>
                <div className={finalStyle.final__main__container}>
                    <div className={finalStyle.final__small__container}>
                        <div className={finalStyle.final__small__block}>
                            <div className={textStyle.small__text}>Сумма договора лизинга</div>
                            <div className={finalStyle.final__price}>{sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽</div>
                        </div>

                        <div className={finalStyle.final__small__block}>
                            <div className={textStyle.small__text}>Ежемесячный платеж от</div>
                            <div className={finalStyle.final__price}>{monthlyPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽</div>
                        </div>
                    </div>
                    {
                        (meta == "initial") ?
                        <div className={finalStyle.final__button} onClick={postData}>Оставить заявку</div>:
                        <div className={finalStyle.final__button__loading} />
                    }
                </div>
            </div>
    );
}

export default App;
