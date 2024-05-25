import { DoProcessArmorOutput, DoProcessArmorParams, truncatedDoProcessArmor } from '.';

export type MessageInput = {
  eventId: number;
  doProcessArmorParams: DoProcessArmorParams;
}

export type MessageOutput = {
  eventId: number;
  result: DoProcessArmorOutput
}

self.onmessage = (e: MessageEvent<MessageInput>) => {
  console.log('[processArmorWorker] start');
  const result = truncatedDoProcessArmor(e.data.doProcessArmorParams);
  self.postMessage({
    eventId: e.data.eventId,
    result
  } as MessageOutput
  );
  console.log('[getLoadoutsThatCanBeOptimizedWorker] done');
};

export { };

