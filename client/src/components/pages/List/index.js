import React, {useState} from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import NFT from "../../NFT";
import {TreasurContract, web3, IERC20Contract} from "../../Web3Connect";
import {useSelector, useDispatch} from "react-redux";
import { addVideo } from '../../../store/actions/VideoAction'
import {
  Container,
  Input,
  InputGroup,
  VStack,
  Button,
  InputLeftElement
} from "@chakra-ui/react";
const index = () => {
  const [price, setPrice] = useState(0);
  const dispatch = useDispatch();
  let history = useHistory();
  const {address} = useSelector((state) => state.connectWallet);
  const {tokenURI} = useSelector((state) => state.video);
  const handleOnChange = (e) => {
    setPrice(e.target.value);
  };
  const handleOnClick = async () => {
    const EthUsdPrice = await TreasurContract.methods.chainLinkPrice().call();
    const EthPrice = price / (EthUsdPrice * Math.pow(10, -8)).toPrecision(8);
    const approval = await IERC20Contract.methods
      .approve(
        TreasurContract.options.address,
        web3.utils.toWei(`${EthPrice.toPrecision(8)}`, "ether")
      )
      .send({from: address});
    const offer = await TreasurContract.methods
      .offer(
        web3.utils.utf8ToHex(tokenURI),
        web3.utils.toWei(`${EthPrice.toPrecision(8)}`, "ether")
      )
      .send({from: address});
      try {
        await axios.post("/offer", {
          tokenURIStr: tokenURI
        })
      } catch (error) {
        console.log(error)
      }
    try {
      const tokenId = await axios.post("/mint", {
        tokenUri: web3.utils.utf8ToHex(tokenURI),
        tokenURIStr: tokenURI,
        tokenCreator: address,
      });
      console.log(`rv from mint ${tokenId}`)
      dispatch(addVideo(tokenURI))
      history.push(`/nft/${tokenURI}`)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Container size="lg">
        <VStack>
          <NFT id={tokenURI} />
          <InputGroup style={input}>
            <InputLeftElement children="$" />
            <Input focusBorderColor="#652B19" placeholder="Enter Amount" onChange={handleOnChange} />
          </InputGroup>
          <Button style={mintButton} onClick={handleOnClick}>
            Confirm Listing
          </Button>
        </VStack>
      </Container>
    </div>
  );
};

const input = {
  marginTop: "2rem"
}
const mintButton = {
  backgroundColor: "#281A03",
  color: "white",
  margin: "2rem",
  width: "30%",
};

export default index;
