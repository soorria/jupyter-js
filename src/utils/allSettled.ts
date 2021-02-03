const allSettled = (promises: Promise<any>[]) =>
  Promise.all(
    promises.map(promise =>
      promise.then(
        value => ({ statues: 'fulfilled', value }),
        reason => ({ status: 'rejected', reason })
      )
    )
  )

export default allSettled
