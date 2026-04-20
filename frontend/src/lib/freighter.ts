import { NETWORK } from './constants';

type FreighterSignResult =
  | string
  | {
      signedTxXdr?: string;
      error?: { message?: string } | string;
    };

function getErrorMessage(err: unknown): string {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message ?? 'Unknown Freighter error');
  }
  return 'Unknown Freighter error';
}

export async function signWithFreighter(xdr: string): Promise<string> {
  const { signTransaction } = await import('@stellar/freighter-api');
  const result = (await signTransaction(xdr, {
    networkPassphrase: NETWORK.PASSPHRASE,
  })) as FreighterSignResult;

  if (typeof result === 'string') {
    return result;
  }

  if (result?.error) {
    throw new Error(getErrorMessage(result.error));
  }

  if (result?.signedTxXdr) {
    return result.signedTxXdr;
  }

  throw new Error('Freighter returned an unexpected signing response');
}
