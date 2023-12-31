import { component$, useStore, useTask$, $ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import type { TreflePlant, SearchStore } from '~/types';
import * as _ from 'lodash-es'
import { trefle } from '~/helpers/trefle';
import { image } from '~/helpers/image';
import { LoadMore } from '../load-more/LoadMore';

const searchFlowers = async (store: SearchStore, nav: (path: string) => void, append = false) => {
    nav( `/search/${store.search}`)
    store.isFetching = true
    if (!append) store.results = []
    const results = store.search ? await trefle(store.search, 10, store.page) : []
    store.results.push(...results)
    store.isFetching = false
}

const searchFlowersDebounced = _.debounce(searchFlowers, 600)

export default component$(() => {
    const location = useLocation()
    const nav = useNavigate();

    const store: SearchStore = useStore({
        search: location.params.term ?? '',
        previousSearch: '',
        results: [],
        page: 1,
        isFetching: false
    })

    useTask$(async () => {
        if (location.params.term) store.results = await trefle(location.params.term)
    });

    const showLoading = !!(store.isFetching && !store.results?.length)

    return (
        <div>
            <input 
                value={store.search}
                type="search"
                onInput$={(_, el) => {
                    store.previousSearch = store.search
                    store.search = el.value.replace(/\W/g, '')

                    if (store.previousSearch !== store.search) {
                        if (store.search) searchFlowersDebounced(store, nav) 
                        else searchFlowers(store, nav)
                    }
                }} />
                
            {showLoading ? 
                <span>Loading...</span> : 
                <ul>
                    {store.results?.map((item: TreflePlant) => {
                        return (
                            <li key={item.id}>
                                <h3>{item.common_name ?? item.scientific_name}</h3>
                                {item.image_url ? image(item.image_url, 100, 100, item.common_name ?? item.scientific_name) : null}
                            </li>
                        )
                    })}
                    {store.results.length ? <li>
                        <LoadMore action$={$(function () {
                            store.page = store.page + 1
                            searchFlowers(store, nav, true)
                        })} />
                    </li> : null}
                </ul>
            }
        </div>
   )
})