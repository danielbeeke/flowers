import type { TreflePlant } from '~/types';
import { trefleApi } from '~/constants';
import { server$ } from '@builder.io/qwik-city';

export const trefle = server$(async function (searchTerm: string, limit = 10, page = 1): Promise<Array<TreflePlant>> {
    try {
        const response = await fetch(`${trefleApi}/species/search?q=${searchTerm}&page=${page}&limit=${limit}&token=${this.env.get('TREFLE_TOKEN')}`)
        const { data } = await response.json()
        return data.map((item: TreflePlant) => ({
            common_name: item.common_name,
            image_url: item.image_url,
            scientific_name: item.scientific_name
        }))
    }
    catch {
        return []
    }
})