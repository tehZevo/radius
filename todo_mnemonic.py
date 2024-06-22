import binascii
from bip_utils import (
    Bip39EntropyBitLen, Bip39EntropyGenerator, Bip39WordsNum, Bip39Languages, Bip39MnemonicGenerator, Bip39MnemonicEncoder
)
from bip_utils import (
    MnemonicChecksumError, Bip39Languages, Bip39WordsNum, Bip39Mnemonic,
    Bip39MnemonicGenerator, Bip39MnemonicValidator, Bip39MnemonicDecoder
)

#generate
mnemonic = Bip39MnemonicGenerator().FromWordsNumber(Bip39WordsNum.WORDS_NUM_12)
mnemonic = str(mnemonic)

#parse
#mnemonic = Bip39Mnemonic.FromList(mnemonic.split())
mnemonic = Bip39Mnemonic.FromList(mnemonic.split())

# Get if a mnemonic is valid with automatic language detection, return bool
is_valid = Bip39MnemonicValidator().IsValid(mnemonic)

if not is_valid:
    print("mnemonic was not valid")
    
# Use Bip39MnemonicDecoder to get back the entropy bytes from a mnemonic, specifying the language
entropy_bytes = Bip39MnemonicDecoder(Bip39Languages.ENGLISH).Decode(mnemonic)
# Like before with automatic language detection
entropy_bytes = Bip39MnemonicDecoder().Decode(mnemonic)

# print(len(entropy_bytes))

# Alternatively, it's possible to get back the entropy bytes with the computed checksum
entropy_chksum_bytes = Bip39MnemonicDecoder(Bip39Languages.ENGLISH).DecodeWithChecksum(mnemonic)


###
#based on https://github.com/libp2p/py-libp2p/blob/0326e34870523fafbc9e59222800669810c56618/libp2p/crypto/ed25519.py#L23
from nacl.public import PrivateKey

key = PrivateKey.from_seed(entropy_bytes)
# print(key)