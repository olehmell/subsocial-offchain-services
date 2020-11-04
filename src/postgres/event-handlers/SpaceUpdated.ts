import { SpaceId } from '@subsocial/types/substrate/interfaces/subsocial';
import { substrate } from '../../connections/subsocial';
import { SubstrateEvent, EventHandlerFn } from '../../substrate/types';

export const onSpaceUpdated: EventHandlerFn = async (eventAction: SubstrateEvent) => {
  const { data } = eventAction;
  const spaceId = data[1] as SpaceId;
  const space = await substrate.findSpace({ id: spaceId });
  if (!space) return;
}
