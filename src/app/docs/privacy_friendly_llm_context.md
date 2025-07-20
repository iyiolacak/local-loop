# Tag-driven context isolation

Every output would tag input and the output aggressively, and to not send a whole history of tasks and logs to an LLM service, we'd query only with tags. i.e. an input received and LLM would query with tags, tags would point to tasks and logs(i.e. tasks under `since 7 days` + `#cinema4d` -> `#redshift` -> `#material-texture`)