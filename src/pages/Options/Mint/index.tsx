import { t, Trans } from "@lingui/macro";
import { BigNumber } from "ethers";
import { FC, useCallback, useEffect, useState } from "react";
import ChooseType from "../../../components/ChooseType";
import { PutDownIcon } from "../../../components/Icon";
import InfoShow from "../../../components/InfoShow";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import {
  DoubleTokenShow,
  SingleTokenShow,
} from "../../../components/TokenShow";
import {
  FortEuropeanOptionContract,
  tokenList,
} from "../../../libs/constants/addresses";
import {
  ERC20Contract,
  FortEuropeanOption,
  NestPriceContract,
} from "../../../libs/hooks/useContract";
import useWeb3 from "../../../libs/hooks/useWeb3";
import {
  bigNumberToNormal,
  formatInputNum,
  normalToBigNumber,
  ZERO_ADDRESS,
} from "../../../libs/utils";
import { DatePicker, message } from "antd";
import "../../../styles/ant.css";
import "./styles";
import moment from "moment";
import { OptionsInfo } from "..";

type Props = {
  reviewCall: (info: OptionsInfo, isMint: boolean) => void;
};

const MintOptions: FC<Props> = ({ ...props }) => {
  const classPrefix = "options-mintOptions";
  const { account, chainId, library } = useWeb3();
  const nestPriceContract = NestPriceContract();
  const fortEuropeanOption = FortEuropeanOption(FortEuropeanOptionContract);
  const fortContract = ERC20Contract(tokenList["DCU"].addresses);

  const [isLong, setIsLong] = useState(false);
  const [exercise, setExercise] = useState({ time: "---", blockNum: 0 });
  const [strikePrice, setStrikePrice] = useState("");
  const [fortNum, setFortNum] = useState("");

  const [optionTokenNumBaseInfo, setOptionTokenNumBaseInfo] = useState({
    strikePrice: "0",
    fortNum: "0",
  });
  const [priceNow, setPriceNow] = useState("--.--");
  const [fortBalance, setFortBalance] = useState(BigNumber.from(0));
  const [tokenName, setTokenName] = useState("");
  const [optionTokenValue, setOptionTokenValue] = useState(BigNumber.from(0));

  useEffect(() => {
    if (fortContract) {
      fortContract.balanceOf(account).then((value: any) => {
        setFortBalance(BigNumber.from(value));
      });
      return;
    }
    setFortBalance(BigNumber.from(0));
  }, [account, fortContract]);

  useEffect(() => {
    if (nestPriceContract && priceNow === "--.--" && chainId) {
      nestPriceContract
        .latestPrice(tokenList["USDT"].addresses[chainId])
        .then((value: any) => {
          setPriceNow(bigNumberToNormal(value[1], tokenList["USDT"].decimals));
        });
    }
  }, [chainId, nestPriceContract, priceNow]);

  useEffect(() => {
    if (exercise.blockNum === 0 || strikePrice === "") {
      setTokenName("---");
    } else {
      const oneStr = isLong ? "C" : "P";
      const strikePriceStr = normalToBigNumber(
        strikePrice,
        tokenList["USDT"].decimals
      ).toString();
      const twoStr =
        strikePriceStr.substr(0, 1) +
        "." +
        strikePriceStr.substr(1, 6) +
        "+" +
        (strikePriceStr.length - 7).toString();
      const threeStr = "ETH";
      const fourStr = exercise.blockNum;
      const newTokenName = oneStr + twoStr + threeStr + fourStr;
      setTokenName(newTokenName);
    }
  }, [exercise.blockNum, isLong, strikePrice]);

  const handleType = (isLong: boolean) => {
    setIsLong(isLong);
  };

  const onOk = useCallback(
    async (value: any) => {
      const nowTime = moment().valueOf();
      const selectTime = moment(value).valueOf();
      const latestBlock = await library?.getBlockNumber();

      if (selectTime > nowTime) {
        const timeString = moment(value).format("YYYY[-]MM[-]DD");
        const blockNum = parseFloat(
          ((selectTime - nowTime) / 13000).toString()
        ).toFixed(0);
        setExercise({
          time: timeString,
          blockNum: Number(blockNum) + (latestBlock || 0),
        });
      } else {
        const timeString = moment().format("YYYY[-]MM[-]DD");
        setExercise({ time: timeString, blockNum: latestBlock || 0 });
      }
    },
    [library]
  );

  const optionInfo: OptionsInfo = {
    fortAmount: normalToBigNumber(fortNum),
    optionToken: ZERO_ADDRESS,
    optionTokenName: tokenName,
    optionTokenAmount: optionTokenValue,
    type: isLong,
    strikePrice: normalToBigNumber(strikePrice, tokenList["USDT"].decimals),
    exerciseTime: exercise.time,
    blockNumber: BigNumber.from(exercise.blockNum),
  };

  useEffect(() => {
    if (
      fortEuropeanOption &&
      optionTokenNumBaseInfo.strikePrice !== "0" &&
      optionTokenNumBaseInfo.fortNum !== "0" &&
      priceNow !== "--.--" &&
      exercise.blockNum !== 0
    ) {
      (async () => {
        const value = await fortEuropeanOption.estimate(
          ZERO_ADDRESS,
          normalToBigNumber(priceNow, tokenList["USDT"].decimals).toString(),
          normalToBigNumber(
            optionTokenNumBaseInfo.strikePrice,
            tokenList["USDT"].decimals
          ).toString(),
          isLong,
          exercise.blockNum.toString(),
          normalToBigNumber(optionTokenNumBaseInfo.fortNum).toString()
        );
        setOptionTokenValue(BigNumber.from(value));
      })();
    }
  }, [
    isLong,
    optionTokenNumBaseInfo,
    exercise.blockNum,
    priceNow,
    fortEuropeanOption,
  ]);

  const checkButton = () => {
    if (
      fortNum === "" ||
      strikePrice === "" ||
      exercise.blockNum === 0 ||
      normalToBigNumber(fortNum).gt(fortBalance) ||
      normalToBigNumber(strikePrice, tokenList["USDT"].decimals).eq(
        BigNumber.from("0")
      )
    ) {
      return true;
    }
    return false;
  };
  function disabledDate(current: any) {
    return current && current < moment().add(7, "days").startOf("day");
  }

  // function disabledDateTime(date: any) {
  //     var nowHour:number
  //     if (date && moment().format("MMM Do YY") === date.format("MMM Do YY")) {
  //         nowHour = Number(moment().format('HH')) + 2
  //     } else {
  //         nowHour = 0
  //     }
  //     return {
  //         disabledHours: () => range(0, 24).splice(0, nowHour)
  //     };
  // }

  // function range(start: number, end: number) {
  //     const result = [];
  //     for (let i = start; i < end; i++) {
  //         result.push(i);
  //     }
  //     return result;
  // }
  return (
    <div className={classPrefix}>
      <MainCard classNames={`${classPrefix}-leftCard`}>
        <InfoShow topLeftText={t`Token pair`} bottomRightText={""}>
          <DoubleTokenShow tokenNameOne={"ETH"} tokenNameTwo={"USDT"} />
          <button className={"select-button"}>
            <PutDownIcon />
          </button>
        </InfoShow>
        <ChooseType callBack={handleType} isLong={isLong} />
        <InfoShow
          topLeftText={t`Exercise time`}
          bottomRightText={`Block number: ${exercise.blockNum}`}
        >
          <DatePicker
            format="YYYY-MM-DD"
            disabledDate={disabledDate}
            onChange={onOk}
            bordered={false}
            suffixIcon={<PutDownIcon />}
            placeholder={t`Exercise time`}
            allowClear={false}
          />
          {/* <DatePicker 
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                disabledTime={disabledDateTime} 
                showTime
                onOk={onOk} 
                bordered={false} 
                suffixIcon={(<PutDownIcon/>)} 
                placeholder={t`Exercise time`} allowClear={false}/> */}
        </InfoShow>

        <InfoShow
          topLeftText={t`Strike price`}
          bottomRightText={`1 ETH = ${priceNow} USDT`}
        >
          <input
            placeholder={t`Input`}
            className={"input-left"}
            value={strikePrice}
            onChange={(e) => setStrikePrice(formatInputNum(e.target.value))}
            onBlur={(e: any) =>
              setOptionTokenNumBaseInfo({
                ...optionTokenNumBaseInfo,
                strikePrice: e.target.value,
              })
            }
          />
          <span>USDT</span>
        </InfoShow>
        <InfoShow
          topLeftText={t`Mint amount`}
          bottomRightText={`Balance: ${bigNumberToNormal(fortBalance)} DCU`}
          balanceRed={normalToBigNumber(fortNum).gt(fortBalance) ? true : false}
        >
          <SingleTokenShow tokenNameOne={"DCU"} isBold />
          <input
            placeholder={t`Input`}
            className={"input-middle"}
            value={fortNum}
            onChange={(e) => setFortNum(formatInputNum(e.target.value))}
            onBlur={(e: any) =>
              setOptionTokenNumBaseInfo({
                ...optionTokenNumBaseInfo,
                fortNum: e.target.value,
              })
            }
          />
          <button
            className={"max-button"}
            onClick={() => setFortNum(bigNumberToNormal(fortBalance))}
          >
            MAX
          </button>
        </InfoShow>
      </MainCard>

      <MainCard classNames={`${classPrefix}-rightCard`}>
        <p className={`${classPrefix}-rightCard-tokenTitle`}>
          <Trans>Estimated number of European Options Token</Trans>
        </p>
        <p className={`${classPrefix}-rightCard-tokenValue`}>
          {bigNumberToNormal(optionTokenValue, 18, 6)}
        </p>
        <p className={`${classPrefix}-rightCard-tokenName`}>{tokenName}</p>
        <MainButton
          disable={checkButton()}
          onClick={() => {
            if (normalToBigNumber(fortNum).gt(fortBalance)) {
              message.error(t`Insufficient balance`);
              return;
            }
            if (checkButton()) {
              return;
            }
            props.reviewCall(optionInfo, true);
          }}
        >
          <Trans>Mint</Trans>
        </MainButton>
        <div className={`${classPrefix}-rightCard-time`}>
          <p className={`${classPrefix}-rightCard-timeTitle`}>
            <Trans>At</Trans>
            {` ${exercise.time}`}
          </p>
          <p className={`${classPrefix}-rightCard-timeValue`}>
            <Trans>compare with spot price and srike price</Trans>
          </p>
        </div>

        <div className={`${classPrefix}-rightCard-smallCard`}>
          <MainCard>
            <div className={`${classPrefix}-rightCard-smallCard-title`}>
              <p>
                <Trans>Spot price</Trans>
                {isLong ? ">" : "<"}
                {bigNumberToNormal(normalToBigNumber(strikePrice), 18, 6)}
              </p>
              <p>
                <Trans>Expected get</Trans>
              </p>
            </div>
            <p className={`${classPrefix}-rightCard-smallCard-value`}>
              {isLong
                ? t`(Spot price - Strike price)*`
                : t`(Strike price - Spot price)*`}
              {bigNumberToNormal(optionTokenValue, 18, 2)}
            </p>
            <p className={`${classPrefix}-rightCard-smallCard-name`}>FORT</p>
          </MainCard>
          <MainCard>
            <div className={`${classPrefix}-rightCard-smallCard-title`}>
              <p>
                <Trans>Spot price</Trans>
                {isLong ? "<=" : ">="}
                {bigNumberToNormal(normalToBigNumber(strikePrice), 18, 6)}
              </p>
              <p>
                <Trans>Expected get</Trans>
              </p>
            </div>
            <p className={`${classPrefix}-rightCard-smallCard-value`}>{"0"}</p>
            <p className={`${classPrefix}-rightCard-smallCard-name`}>FORT</p>
          </MainCard>
        </div>
      </MainCard>
    </div>
  );
};

export default MintOptions;
