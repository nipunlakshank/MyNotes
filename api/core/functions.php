<?php

function getToken(): string
{
    return bin2hex(random_bytes(32));
}

function esc($str): string
{
    return nl2br(htmlspecialchars($str));
}

